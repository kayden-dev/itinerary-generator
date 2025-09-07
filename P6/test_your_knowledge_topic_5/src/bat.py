'''
Author: Charlotte Pierce

Assignment code for FIT2107 Software Quality and Testing.
Not to be shared or distributed without permission.
'''

from src.bat_ui import BatUI
from src.data_mgmt import DataManager

class Bat():
    '''
    This class is responsible for initialising BAT data and executing
    the BAT software.
    '''
    def run(self):
        '''
        Run BAT.

        Creates an instance of the BAT software and a data manager with
        patron and catalogue data loaded, then runs the main BAT execution
        loop.
        '''
        data_manager = DataManager()

        ui = BatUI(data_manager)
        while ui.get_current_screen() != "QUIT":
            ui.run_current_screen()

        ui.run_current_screen() # run the quit screen

