# IMPORTANT guidelines for writing test cases :
Most of the CLI commands under `src/commands` abstract and trigger other well 
established/tested commands from `Node`, `Nx`, `Angular` etc. 
For this reason, the effect of such commands need not be tested redundantly.

However, the custom utility functions and tools used to craft and compose 
these commands should be tested thoroughly.

Also, if your command does not rely on established/tested commands from 
platforms like `Node`, `Nx`, `Angular` etc. to make changes to a user's 
machine, it would be wise to add proper test cases to validate the 
them before releasing a change.

# In summary :
Any command that directly mutates a user's file system, system settings
or configuration without the use of well established/tested packages
or APIs should be throroughly tested.



