// import { LightningElement, api, wire } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { NavigationMixin } from 'lightning/navigation';
// import Assigned_To__c from '@salesforce/schema/Assignment__c.Assigned_To__c';
// import Name from '@salesforce/schema/Assignment__c.Name';
// import Assignment_Type__c from '@salesforce/schema/Assignment__c.Assignment_Type__c';
// import Description__c from '@salesforce/schema/Assignment__c.Description__c';
// import Due_Date__c from '@salesforce/schema/Assignment__c.Due_Date__c';
// import Parent_Assignment__c from '@salesforce/schema/Assignment__c.Parent_Assignment__c';
// import Related_To__c from '@salesforce/schema/Assignment__c.Related_To__c';
// import Priority__c from '@salesforce/schema/Assignment__c.Priority__c';
// import Status__c from '@salesforce/schema/Assignment__c.Status__c';


 
// export default class AssignmentCreationWithRecordForm extends NavigationMixin(LightningElement) {
 
   
//     fields = [Description__c, Assigned_To__c, Name, Assignment_Type__c, Due_Date__c, Parent_Assignment__c,Priority__c,Related_To__c,Status__c];
//     isShowModal=false;
//     Assigntemp=true;
//     isShowsecondModal = false;
    
//     handleSuccess(event) {
//         const recordId = event.detail.id;
//         const evt = new ShowToastEvent({
//                 title: 'Record Created Successfully!',
//                 message: 'Record Created Successfully!!',
//                 variant: 'success',
    
//             });
            
//         this[NavigationMixin.Navigate]({
//             type: 'standard__recordPage',
//             attributes: {
//                 recordId: recordId,
                
//                 actionName: 'view',
//             }
//         });
//         this.dispatchEvent(evt);
       


//      }
//     }



import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';

import ASSIGNED_TO_FIELD from '@salesforce/schema/Assignment__c.Assigned_To__c';
import NAME_FIELD from '@salesforce/schema/Assignment__c.Name';
import ASSIGNMENT_TYPE_FIELD from '@salesforce/schema/Assignment__c.Assignment_Type__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Assignment__c.Description__c';
import DUE_DATE_FIELD from '@salesforce/schema/Assignment__c.Due_Date__c';
import PARENT_ASSIGNMENT_FIELD from '@salesforce/schema/Assignment__c.Parent_Assignment__c';
import Related_To__c from '@salesforce/schema/Assignment__c.Related_To__c';
import PRIORITY_FIELD from '@salesforce/schema/Assignment__c.Priority__c';
import STATUS_FIELD from '@salesforce/schema/Assignment__c.Status__c';

export default class AssignmentCreationWithRecordForm extends LightningElement {
    @track assignedTo;
    @track name;
    @track assignmentType;
    @track description;
    @track dueDate;
    @track parentAssignment;
    @track relatedTo;
    @track priority;
    @track status;

    handleInputChange(event) {
        const fieldName = event.target.label;
        const value = event.target.value;

        switch (fieldName) {
            case 'Assigned To':
                this.assignedTo = value;
                break;
            case 'Name':
                this.name = value;
                break;
            case 'Assignment Type':
                this.assignmentType = value;
                break;
            case 'Description':
                this.description = value;
                break;
            case 'Due Date':
                this.dueDate = value;
                break;
            case 'Parent Assignment':
                this.parentAssignment = value;
                break;
            case 'Related To':
                this.relatedTo = value;
                break;
            case 'Priority':
                this.priority = value;
                break;
            case 'Status':
                this.status = value;
                break;
            default:
                break;
        }
    }

    handleCreateRecord() {
        const fields = {};
        
        fields[ASSIGNED_TO_FIELD.fieldApiName] = this.assignedTo;
        fields[NAME_FIELD.fieldApiName] = this.name;
        fields[ASSIGNMENT_TYPE_FIELD.fieldApiName] = this.assignmentType;
        fields[DESCRIPTION_FIELD.fieldApiName] = this.description;
        fields[DUE_DATE_FIELD.fieldApiName] = this.dueDate;
        fields[PARENT_ASSIGNMENT_FIELD.fieldApiName] = this.parentAssignment;
        fields[Related_To__c.fieldApiName] = this.relatedTo;
        fields[PRIORITY_FIELD.fieldApiName] = this.priority;
        fields[STATUS_FIELD.fieldApiName] = this.status;

        const objectApiName = 'Assignment__c';

        createRecord({ apiName: objectApiName, fields })
            .then(record => {
                console.log('Record ID: ', record.id);
            })
            .catch(error => {
                console.error('Error creating record: ', error);
            });
    }
}