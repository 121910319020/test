import { LightningElement, track, api, wire } from 'lwc';
import getRelatedFilesByRecordId from '@salesforce/apex/filePreviewAndDownloadController.getRelatedFilesByRecordId';
import deleteDocument from '@salesforce/apex/filePreviewAndDownloadController.deleteDocument';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

export default class FilePreviewAndDownload extends NavigationMixin(LightningElement) {
    @api recordId;
    checkspinner = false;
    @track ObjectForFile;
    filesList = [];
    isRefreshing = false;
    @track showAllFiles = false;

    @wire(getRelatedFilesByRecordId, { recordId: '$recordId' })
    wiredResult(result) {
        this.ObjectForFile = result;

        if (result.data) {
            this.filesList = Object.keys(result.data).map(item => ({
                label: result.data[item],
                value: item,
                url: `/sfc/servlet.shepherd/document/download/${item}`
            }));
        } else if (result.error) {
            console.error('Error fetching related files:', result.error);
        }
    }

    connectedCallback() {
        this.refreshData();
    }

    refreshData() {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            refreshApex(this.ObjectForFile)
                .then(() => {
                    console.log('Refreshed successfully');
                })
                .catch(error => {
                    console.error('Error refreshing files:', error);
                })
                .finally(() => {
                    this.isRefreshing = false;
                });
        }
    }

    previewHandler(event) {
        this.refreshData(); // Stop refreshing while previewing

        const selectedRecordId = event.target.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'filePreview'
            },
            state: {
                selectedRecordId
            }
        });
    }

    deleteHandler(event) {
         
        const isConfirmed = confirm("Are you sure you want to delete this File from the record ?");

        if (isConfirmed) {
            this.checkspinner = true;

            const documentId = event.target.dataset.id;

            deleteDocument({ recordId: this.recordId, documentId })
                .then(() => {
                    this.toast('Deleted Successfully.', 'success');
                    this.refreshData();
                })
                .catch(error => {
                    console.error('Error deleting document:', error);
                    this.toast('Error deleting document.', 'error');
                })
                .finally(() => {
                    this.checkspinner = false;
                    
                });
        }
    }

    previewRelatedFiles() {
       this.refreshData();
        this.showAllFiles = !this.showAllFiles;
    }

    toast(title, variant) {
        const toastEvent = new ShowToastEvent({
            title,
            variant
        });
        this.dispatchEvent(toastEvent);
    }
}