import os
import sys
import json
import requests
from datetime import datetime

from fastapi import FastAPI, status, APIRouter
from fastapi.responses import JSONResponse

from prompt.ingestion.util import setup_client
from prompt.retrieval.simple_engine import SimpleWeaviateQueryEngine
from prompt.retrieval.advanced_engine import AdvancedWeaviateQueryEngine

from app.models.website import GetQueryPayload, GetRegeneratePayload
from app.models.website import GetDatePayload, GetDate, GetReactionPayload
from app.config.env_manager import get_env_manager
from logs.loggers.logger import logger_config

logger = logger_config(__name__)
env_manager = get_env_manager()

router = APIRouter()

weaviate_engine = AdvancedWeaviateQueryEngine()
simple_weaviate_engine = SimpleWeaviateQueryEngine()

#----------------------------------health check api end-point---------------------------------------
@router.get("/health")
async def root():
    try:
        if weaviate_engine.get_client().is_ready():
            return JSONResponse(
                content={
                    "message": "Alive!",
                }
            )
        else:
            return JSONResponse(
                content={
                    "message": "Database not ready!",
                },
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
    except Exception as e:
        logger.exception(f"Healthcheck failed with {str(e)}")
        return JSONResponse(
            content={
                "message": f"Healthcheck failed with {str(e)}",
            },
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

#------------------------------------query api end-point--------------------------------------------
@router.post("/query")
async def query(payload: GetQueryPayload):
    try:
        system_msg, results, userId, messageId, sessionId, timestamp = weaviate_engine.query(
        payload.query, env_manager['weaviate_keys']['WEAVIATE_MODEL'], payload.userId, payload.sessionId, payload.role)
        logger.debug(f"Succesfully processed query: {payload.query}")

        return JSONResponse(
            content={
                "system": system_msg,
                "documents": results,
                "userId": userId,
                "messageId": messageId,
                "sessionId": sessionId,
                "timestamp": timestamp,
            }
        )
    except Exception as e:
        logger.exception(f"Query failed {str(e)}")
        return JSONResponse(
            content={
                "system": f"Something went wrong! {str(e)}",
                "documents": [],
                "userId": [],
                "messageId": [],
                "sessionId": [],
                "timestamp": [],
            }
        )

#------------------------------------reaction api end-point-----------------------------------------
@router.post("/reaction")
async def reaction(reaction: GetReactionPayload):

    try:
        _userId, _sessionId, _messageId, \
            _timestamp, _rating, _feedbackText = simple_weaviate_engine.add_reaction(reaction.userId, reaction.sessionId, 
                                                  reaction.messageId, reaction.rating, reaction.feedbackText)
        logger.info(f"Succesfully processed reaction")
        
        return JSONResponse(
            content={
                "userId": _userId,
                "rating": _rating,
                "feedbackText": _feedbackText,
                "messageId": _messageId,
                "sessionId": _sessionId,
                "timestamp": _timestamp,
            }
        )
    
    except Exception as e:
        logger.exception(f"Query failed {str(e)}")
        return JSONResponse(
            content={
                "userId": f"Something went wrong! {str(e)}",
                "rating": [],
                "feedbackText": [],
                "messageId": [],
                "sessionId": [],
                "timestamp": [],
            }
        )

#------------------------------------session date api end-point-------------------------------------
@router.post("/sessiondate")
async def sessiondate(datePayload: GetDatePayload):
    try:
        year, month, day = map(int, datePayload.startDate.split('-'))
        _year, _month, _day = map(int, datePayload.endDate.split('-'))

        # Create a datetime object with the extracted components
        start_date_obj = datetime(year, month, day, 0, 0, 0)
        end_date_obj = datetime(_year, _month, _day, 0, 0, 0)

        # Define your start and end dates as parameters
        start_date_param = start_date_obj
        end_date_param = end_date_obj

        # Convert the date parameters to ISO format without trailing zeros
        start_date_iso = start_date_param.strftime("%Y-%m-%dT%H:%M:%SZ")
        end_date_iso = end_date_param.strftime("%Y-%m-%dT%H:%M:%SZ")

        # Perform the query to retrieve the data without date filtering
        result = (
            SimpleWeaviateQueryEngine.client.query
            .get("CacheNana", ["query", "system", "userId", "messageId", 
                               "sessionId", "timestamp"])
            .do()
        )

        # Filter the results based on the date range
        filtered_results = [
            item for item in result["data"]["Get"]["CacheNana"]
            if start_date_iso <= item["timestamp"] <= end_date_iso
            and item["userId"] == datePayload.userId
        ]

        logger.info(f"Succesfully processed query")

        return JSONResponse(
            content={
                "response": filtered_results,
            }
        )
    except Exception as e:
        logger.exception(f"Query failed {str(e)}")
        return JSONResponse(
            content={
                "respose": f"Something went wrong! {str(e)}",
            }
        )

#------------------------selection by sessionid api end-point----------------------------------
@router.get("/sessionid/{userId}")
async def sessionid(userId: str):
    try:
        # Perform the query to retrieve the data without date filtering
        result = (
            SimpleWeaviateQueryEngine.client.query
            .get("CacheNana", ["query", "system", "userId", "messageId", "sessionId", 
                               "timestamp"])
            .do()
        )

        # Filter the results based on the date range and userId
        filtered_results = [
            item for item in result["data"]["Get"]["CacheNana"]
            if item["userId"] == userId
        ]

        # Create a dictionary to store the latest timestamp for each session
        latest_timestamps = {}
        session_dates = {}
        session_counters = {}

        # Iterate through filtered results to find the latest timestamp for each session
        for item in filtered_results:
            sessionId = item["sessionId"]
            timestamp = item["timestamp"]

            if sessionId in latest_timestamps:
                if timestamp > latest_timestamps[sessionId]:
                    latest_timestamps[sessionId] = timestamp
            else:
                latest_timestamps[sessionId] = timestamp

            # Extract the session date and counter (e.g., "23-11-2022_system-8")
            parts = sessionId.split("_")
            session_date = datetime.strptime(parts[0], "%d-%m-%Y")
            part = parts[1].split("-")
            
            # Extract session counter directly from the session ID
            try:
                session_counter = int(part[1]) if part[1].isdigit() else 0
            except Exception as e:
                session_counter = 0

            # Store session date and counter for each session
            session_dates[sessionId] = session_date
            session_counters[sessionId] = session_counter

        # Sort sessionIds based on the session date in descending order and then counter in descending order
        sorted_sessionIds = sorted(
            latest_timestamps.keys(),
            key=lambda sessionId: (session_dates[sessionId], session_counters[sessionId]),
            reverse=True,
        )

        # Group the sorted sessionIds with their corresponding data
        grouped_results = {}
        for sessionId in sorted_sessionIds:
            session_data = [item for item in filtered_results 
                            if item["sessionId"] == sessionId]
            # Sort the session data by timestamp in ascending order
            sorted_session_data = sorted(
                session_data, key=lambda x: x["timestamp"], reverse=True
            )
            grouped_results[sessionId] = sorted_session_data

        logger.info(f"Successfully processed query")
        return JSONResponse(
            content={
                "response": grouped_results,
            }
        )
    
    except Exception as e:
        logger.exception(f"Query failed {str(e)}")
        return JSONResponse(
            content={
                "response": f"Something went wrong! {str(e)}",
            }
        )

#--------------------------------chat regenerate end-points------------------------------------
@router.post("/regenerate")
async def regenerate(regenerate: GetRegeneratePayload):
    # 
    try:
        system_msg, results, _userId, _messageId, _sessionId, _timestamp, \
            _system_output, _feedbackText = weaviate_engine.query_regenerator(
            regenerate.query, regenerate.userId, regenerate.sessionId, regenerate.messageId, regenerate.role)
        logger.debug(f"Succesfully processed query: {regenerate.query}")

        return JSONResponse(
            content={
                "system": system_msg,
                "documents": results,
                "userId": _userId,
                "messageId": _messageId,
                "sessionId": _sessionId,
                "timestamp": _timestamp,
                "system_output": _system_output,
                "feedbackText": _feedbackText,
            }
        )
    except Exception as e:
        logger.exception(f"Query failed {str(e)}")
        return JSONResponse(
            content={
                "system": f"Something went wrong! {str(e)}",
                "documents": [],
                "userId": [],
                "messageId": [],
                "sessionId": [],
                "timestamp": [],
            }
        )

#-------------------------------------dashboard api end-point---------------------------------------
@router.get("/cachereactionsfeedback")
async def reactionstable():
    try:
        logger.info("Starting Excution")
        source_client = SimpleWeaviateQueryEngine.client

        batch_size = 20

        class_name_cache = "CacheNana"
        class_properties_cache = ["userId", "query", "system", "results", "messageId", "sessionId", "timestamp"]

        class_name_reaction = "Reaction"
        class_properties_reaction = ["userId", "rating", "feedbackText", "messageId", "sessionId", "timestamp"]

        cursor_cache = None
        cursor_reaction = None

        def get_batch_with_cursor(client, class_name, class_properties, batch_size, cursor=None):
            logger.debug("Get into the excuter function")
            query = (
                client.query.get(class_name, class_properties)
                # Optionally retrieve the vector embedding by adding `vector` to the _additional fields
                .with_additional(["id vector"])
                .with_limit(batch_size)
            )

            if cursor is not None:
                return query.with_after(cursor).do()
            else:
                return query.do()

        # START FetchClassDefinition
        class_schema_cache = source_client.schema.get(class_name_cache)
        class_schema_reaction = source_client.schema.get(class_name_reaction)

        # Restore to a new (target) instance
        target_client = SimpleWeaviateQueryEngine.client
        with target_client.batch(
            batch_size=batch_size,
        ) as batch:
            logger.debug("Starting Batch process")
            # Batch import all objects to the target instance
            count = 0
            while True:
                logger.debug("Starting While loop")
                # From the SOURCE instance, get the next group of objects
                try:
                    with open("./data/cursor_cache.json", "r") as json_file_cache:
                        try:
                            cursor_cache_load = json.load(json_file_cache)
                        except json.JSONDecodeError:
                            cursor_cache_load = {"cursor_cache": None}
                        except Exception as e:
                            cursor_cache_load = {"cursor_cache": None}

                    with open("./data/cursor_reaction.json", "r") as json_file_reaction:
                        try:
                            cursor_reaction_load = json.load(json_file_reaction)
                        except json.JSONDecodeError:
                            cursor_reaction_load = {"cursor_reaction": None}
                        except Exception as e:
                            cursor_reaction_load = {"cursor_reaction": None}
                        
                except FileNotFoundError:
                    cursor_cache_load = {"cursor_cache": None}
                    cursor_reaction_load = {"cursor_reaction": None}

                cursor_cache = cursor_cache_load["cursor_cache"]
                cursor_reaction = cursor_reaction_load["cursor_reaction"]
                    
                results_cache = get_batch_with_cursor(source_client, class_name_cache, class_properties_cache, batch_size, cursor_cache)
                results_reaction = get_batch_with_cursor(source_client, class_name_reaction, class_properties_reaction, batch_size, cursor_reaction)

                # If empty, we're finished
                if len(results_cache["data"]["Get"][class_name_cache]) == 0:
                    break
               
                # Otherwise, add the objects to the batch to be added to the target instance
                objects_list_cache = results_cache["data"]["Get"][class_name_cache]
                objects_list_reaction = results_reaction["data"]["Get"][class_name_reaction]
            
                aggregate_count_cache = 0
                aggregate_count_reaction = 0

                aggregate_count_cache += len(objects_list_cache)
                aggregate_count_reaction += len(objects_list_reaction)
                
                for retrieved_object in objects_list_cache:
                    new_object = dict()
                    for prop in class_properties_cache:
                        new_object[prop] = retrieved_object[prop]
                    batch.add_data_object(
                        new_object,
                        class_name=class_name_cache,
                        # Can update the vector if it was included in _additional above
                        vector=retrieved_object['_additional']['vector']
                    )

                for retrieved_object in objects_list_reaction:
                    new_object_1 = dict()
                    for prop in class_properties_reaction:
                        new_object_1[prop] = retrieved_object[prop]
                    batch.add_data_object(
                        new_object_1,
                        class_name=class_name_reaction,
                        # Can update the vector if it was included in _additional above
                        vector=retrieved_object['_additional']['vector']
                    )
                
                # Update the cursor to the id of the last retrieved object
                cursor_cache = results_cache["data"]["Get"][class_name_cache][-1]["_additional"]["id"]
                cursor_reaction = results_reaction["data"]["Get"][class_name_reaction][-1]["_additional"]["id"]
                
                data_to_save_cache = {"cursor_cache": cursor_cache}
                data_to_save_reaction = {"cursor_reaction": cursor_reaction}
                
                with open("./data/cursor_cache.json", "w") as json_file_cache:
                    json.dump(data_to_save_cache, json_file_cache, indent=4)

                with open("./data/cursor_reaction.json", "w") as json_file_reaction:
                    json.dump(data_to_save_reaction, json_file_reaction, indent=4)
        
                try:
                    with open("./data/cache.json", "r") as file_c:
                        try:
                            existing_data = json.load(file_c)
                            
                        except json.JSONDecodeError:
                            existing_data = []
                        except EOFError:
                            existing_data = []
                    
                    with open("./data/reaction.json", "r") as file_r:
                        try:
                            existing_data_reaction = json.load(file_r)
                        except json.JSONDecodeError:
                            existing_data_reaction = []
                        except EOFError:
                            existing_data_reaction = []

                except FileNotFoundError:
                    existing_data = []
                    existing_data_reaction = []

                existing_data.extend(objects_list_cache)
                existing_data_reaction.extend(objects_list_reaction)

                with open("./data/cache.json", "w") as file_cache:
                    json.dump(existing_data, file_cache, indent=4)

                with open("./data/reaction.json", "w") as file_reaction:
                    json.dump(existing_data_reaction, file_reaction, indent=4)            

                logger.info(f"Successfully Saved the data!")

                logger.debug(f"Finsih the while loop cursor: {cursor_cache}")
                count+=1
                logger.debug(f"Run Time: {count}")

            logger.info("FINISHED: Out side of while loop")

        __cached__ = results_cache['data']['Get']['CacheNana']
        __reaction__ = results_reaction['data']['Get']['Reaction']

        # Create a dictionary to store reactions by messageId
        reactions_dict = {}
        for reaction in __reaction__:
            message_id = reaction.get("messageId")
            if message_id in reactions_dict:
                reactions_dict[message_id].append(reaction)
            else:
                reactions_dict[message_id] = [reaction]

        # Update CacheNana entries with reactions
        for cached_item in __cached__:
            message_id = cached_item.get("messageId")
            if message_id in reactions_dict:
                cached_item["reactions"] = reactions_dict[message_id]
            else:
                cached_item["reactions"] = []

        # Process the response
        try:
            content={
                "respose": __cached__,
            }
            with open("./data/data.json", "w") as file:   
                json.dump(content, file, indent=4)
            logger.info(f"Successfully Saved the data!")
        except Exception as e:
            logger.exception(f"Query failed {str(e)}")
            return JSONResponse(
                content={
                    "respose": f"Something went wrong! {str(e)}",
                }
            )

        return JSONResponse(
            content={
                "respose": __cached__,
            }
        )
    except Exception as e:
        logger.exception(f"Query failed {str(e)}")
        return JSONResponse(
            content={
                "respose": f"Something went wrong! {str(e)}",
            }
        )
    
#------------------------selection by userId, sessionId api end-point-------------------------------
@router.get("/sessionreset/{userId}")
async def sessionid(userId: str):
    try:
        # Perform the query to retrieve the data without date filtering
        result = (
            SimpleWeaviateQueryEngine.client.query
            .get("CacheNana", ["query", "system", "userId", "messageId", "sessionId", 
                               "timestamp"])
            .do()
        )

        # Filter the results based on the date range and userId
        filtered_results = [
            item for item in result["data"]["Get"]["CacheNana"]
            if item["userId"] == userId
        ]

        # Create a dictionary to store the latest timestamp for each session
        latest_timestamps = {}
        session_dates = {}
        session_counters = {}

        # Iterate through filtered results to find the latest timestamp for each session
        for item in filtered_results:
            sessionId = item["sessionId"]
            timestamp = item["timestamp"]

            if sessionId in latest_timestamps:
                if timestamp > latest_timestamps[sessionId]:
                    latest_timestamps[sessionId] = timestamp
            else:
                latest_timestamps[sessionId] = timestamp

            # Extract the session date and counter (e.g., "23-11-2022_system-8")
            parts = sessionId.split("_")
            session_date = datetime.strptime(parts[0], "%d-%m-%Y")
            part = parts[1].split("-")
            
            # Extract session counter directly from the session ID
            try:
                session_counter = int(part[1]) if part[1].isdigit() else 0
            except Exception as e:
                session_counter = 0

            # Store session date and counter for each session
            session_dates[sessionId] = session_date
            session_counters[sessionId] = session_counter

        # Sort sessionIds based on the session date in descending order and then counter in descending order
        sorted_sessionIds = sorted(
            latest_timestamps.keys(),
            key=lambda sessionId: (session_dates[sessionId], session_counters[sessionId]),
            reverse=True,
        )

        # Group the sorted sessionIds with their corresponding data
        grouped_results = {}
        for sessionId in sorted_sessionIds:
            session_data = [item for item in filtered_results 
                            if item["sessionId"] == sessionId]
            # Sort the session data by timestamp in ascending order
            sorted_session_data = sorted(
                session_data, key=lambda x: x["timestamp"], reverse=True
            )
            grouped_results[sessionId] = sorted_session_data[0]

        logger.info(f"Successfully processed query")
        return JSONResponse(
            content={
                "response": grouped_results,
            }
        )
    
    except Exception as e:
        logger.exception(f"Query failed {str(e)}")
        return JSONResponse(
            content={
                "response": f"Something went wrong! {str(e)}",
            }
        )
    
