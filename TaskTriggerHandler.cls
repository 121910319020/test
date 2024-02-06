public class TaskTriggerHandler {

    public static void handleTaskChanges(List<Assignment__c> newTasks, Map<Id, Assignment__c> oldMap) {
        Set<Id> parentTaskIds = new Set<Id>();
        
        // Collect parent task IDs related to the affected tasks
        for (Assignment__c task : newTasks) {
            if (task.Parent_Assignment__c != null) {
                parentTaskIds.add(task.Parent_Assignment__c);
            }
        }
        
        // Query parent tasks and their related child tasks
        List<Assignment__c> parentTasksToUpdate = [SELECT Id, (SELECT Id, Status__c FROM Assignments__r WHERE Status__c != 'Completed') FROM Assignment__c WHERE Id IN :parentTaskIds];
        
        // Iterate through the parent tasks and update their status if all child tasks are completed
        List<Assignment__c> assignmentsToUpdate = new List<Assignment__c>();
        for (Assignment__c parentTask : parentTasksToUpdate) {
            Boolean allChildTasksCompleted = true;
            for (Assignment__c childTask : parentTask.Assignments__r) {
                if (childTask.Status__c != 'Completed') {
                    allChildTasksCompleted = false;
                    break;
                }
            }
            if (allChildTasksCompleted) {
                Assignment__c assignment = new Assignment__c(Id = parentTask.Id, Status__c = 'Completed');
                assignmentsToUpdate.add(assignment);
            }
        }
        
        // Update the assignment records with updated parent task status
        if (!assignmentsToUpdate.isEmpty()) {
            update assignmentsToUpdate;
        }
    }
}