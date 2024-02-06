import { LightningElement, track, wire,api } from 'lwc';
import getTeamMembers from '@salesforce/apex/AssignmentCreationHandler.getTeamMembers';
import createAssignments from '@salesforce/apex/AssignmentCreationHandler.createAssignments';

export default class AssignmentCreationLWC extends LightningElement {
    @track isAssignmentTypeModalOpen = false;
    @track isAssignmentModalOpen = false;
    @track selectedAssignmentType;
    @track assignmentName;
    @track assignmentDescription;
    @track assignmentDueDate;
    @track assignmentStatus;
    @track assignmentSubject;
    @track assignmentPriority;
    @api recordId;
    @track projectTeamMembers = [];
    @track selectedTeamMembers = [];

    assignmentTypeOptions = [
        { label: 'Create Parent Assignment', value: 'Parent' },
        { label: 'Create Sub Assignment', value: 'Sub' },
    ];

    @wire(getTeamMembers, { projectId: '$recordId' })
    wiredTeamMembers({ data, error }) {
        if (data) {
            this.projectTeamMembers = data;
            console.log(this.projectTeamMembers);
        } else if (error) {
            console.error('Error retrieving team members', error);
        }
    }

    openModal() {
        this.isAssignmentTypeModalOpen = true;
    }

    closeModal() {
        this.isAssignmentTypeModalOpen = false;
        this.isAssignmentModalOpen = false;
        this.resetFields();
    }

    handleAssignmentTypeChange(event) {
        this.selectedAssignmentType = event.detail.value;
    }

    openAssignmentModal() {
        this.isAssignmentTypeModalOpen = false;
        this.isAssignmentModalOpen = true;
    }

    handleTeamMemberChange(event) {
        this.selectedTeamMembers = event.detail.value;
    }

    createAssignment() {
        createAssignments({
            projectId: this.recordId,
            teamMemberIds: this.selectedTeamMembers,
            assignmentType: this.selectedAssignmentType,
            assignmentName: this.assignmentName,
            assignmentDescription: this.assignmentDescription,
            assignmentDueDate: this.assignmentDueDate,
            assignmentStatus: this.assignmentStatus,
            assignmentSubject: this.assignmentSubject,
            assignmentPriority: this.assignmentPriority,
        })
            .then(result => {
                // Handle success
                console.log('Assignments created successfully',result);
                this.closeModal();
            })
            .catch(error => {
                // Handle error
                console.error('Error creating assignments', error);
            });
    }

    resetFields() {
        this.selectedAssignmentType = null;
        this.assignmentName = '';
        this.assignmentDescription = '';
        this.assignmentDueDate = null;
        this.selectedTeamMembers = [];
        this.assignmentStatus = null;
        this.assignmentSubject = '';
        this.assignmentPriority = null; 
        
    }
}