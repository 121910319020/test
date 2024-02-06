public class AssignmentTriggerHandler 
{   
    public static void handleAssignmentChanges(List<Assignment__c> newAssignments, Map<Id, Assignment__c> oldMap) {
        Set<Id> projectIds = new Set<Id>();
        
        // Collect project IDs related to the affected assignments
        for (Assignment__c assignment : newAssignments) {
            projectIds.add(assignment.related_to__c);
        }
        
        // Query all projects related to the affected assignments
        List<Project__c> projectsToUpdate = [SELECT Id, Name,
                                                (SELECT Id, Status__c FROM Tasks__r WHERE Status__c != 'Completed')
                                            FROM Project__c
                                            WHERE Id IN :projectIds];
        
        // Iterate through the projects and update their status if all assignments are completed
        List<Project__c> projectsToUpdateStatus = new List<Project__c>();
        for (Project__c project : projectsToUpdate) {
            Boolean allAssignmentsCompleted = true;
            for (Assignment__c assignment : project.Tasks__r) {
                if (assignment.Status__c != 'Completed') {
                    allAssignmentsCompleted = false;
                    break;
                }
            }
            if (allAssignmentsCompleted) {
                project.project_status__c = 'Completed';
                projectsToUpdateStatus.add(project);
            }
        }
        
        // Update the project statuses
        if (!projectsToUpdateStatus.isEmpty()) {
            update projectsToUpdateStatus;
        }
    }
}