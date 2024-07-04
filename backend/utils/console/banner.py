from utils.console.io import IO


_MAIN_BANNER = r"""{}

      ___                        ___           ___           ___     
     /  /\           ___        /  /\         /  /\         /  /\    
    /  /::\         /__/\      /  /::\       /  /::\       /  /:/    
   /  /:/\:\        \__\:\    /  /:/\:\     /  /:/\:\     /  /:/     
  /  /::\ \:\       /  /::\  /  /::\ \:\   /  /:/  \:\   /  /:/      
 /__/:/\:\_\:\   __/  /:/\/ /__/:/\:\_\:| /__/:/ \__\:\ /__/:/     /\
 \__\/  \:\/:/  /__/\/:/~~  \  \:\ \:\/:/ \  \:\ /  /:/ \  \:\    /:/
      \__\::/   \  \::/      \  \:\_\::/   \  \:\  /:/   \  \:\  /:/ 
      /  /:/     \  \:\       \  \:\/:/     \  \:\/:/     \  \:\/:/  
     /__/:/       \__\/        \__\::/       \  \::/       \  \::/   
     \__\/                         ~~         \__\/         \__\/   
       
                {}by abel & louis  ~  AI for kids!
                            v[_V_]

""".format(IO.Fore.LIGHTGREEN_EX, IO.Style.RESET_ALL + IO.Style.BRIGHT)                                    
# IO.Fore.GREEN

def get_main_banner(version, banner=_MAIN_BANNER):
    return banner.replace('[_V_]', version)

def run_banner():
    """
    Main entry point of the application
    @fetch version from a function
    """

    version = '0.0.1'

    IO.spacer()
    IO.print(get_main_banner(version, _MAIN_BANNER))
    IO.spacer()