import { Component, OnInit } from '@angular/core';
import { ImageService } from '../image.service';
import { Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-vehicle-info',
  templateUrl: './vehicle-info.component.html',
  styleUrls: ['./vehicle-info.component.css'],
})
export class VehicleInfoComponent implements OnInit {
  products: any[] = [];
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  minFromDate: string;
  minToDate: string;
  errorMessage: string;

  selectedOption: string = '';
  selectedDriver: string = '';
  drivingLicenseStatus: string | null = null;
  gender: any;
  panId: string = '';
  customerId: any;
  documentId: string = '';
  message: string = '';
  selectedFile: File | undefined;
  maleDriverPrice: any;
  femaleDriverPrice: any;
  totalAmount: number = 0;

  constructor(
    private service: ImageService,
    private router: Router,
    private documentService: DocumentService
  ) {
    this.fromDate = '';
    this.toDate = '';
    this.numberOfDays = 0;
    this.errorMessage = '';
    const currentDate = new Date();
    this.minFromDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
    this.minToDate = this.minFromDate;
    this.customerId = localStorage.getItem('userid');
    this.gender = localStorage.getItem('gender');
    this.fetchProducts();
    this.femaleDriverPrice = 700;
    this.maleDriverPrice = 700;
    this.calculateTotal(); 
  }

  ngOnInit() {
    this.getStatus();
    this.fetchProducts();
  }

  isButtonEnabled(): boolean {
    if (this.errorMessage) {
      // If there is an error message, disable the button
      return false;
    }
    
    if (this.selectedOption === 'self-driving') {
      return this.drivingLicenseStatus === 'Approved' && !!this.fromDate && !!this.toDate;
    } else if (this.selectedOption === 'driver-service') {
      return (!!this.selectedDriver && (this.selectedDriver === 'Female' || this.selectedDriver === 'Male')) && !!this.fromDate && !!this.toDate;
    } else {
      return false; 
    }
  }

  onFileChanged(event: any) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }

  onUpload() {
    if (!this.selectedFile || !this.panId || !this.documentId) {
      this.message =
        'Please fill all the fields and select an image to upload.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('panId', this.panId);
    formData.append('documentId', this.documentId);
    formData.append('customerId', this.customerId);

    this.documentService.uploadImage(formData).subscribe(
      (data: any) => {
        if (data) {
          this.message = 'Image uploaded successfully';
          this.resetValues();
          this.getStatus();
        } else {
          this.message = 'Image not uploaded successfully';
        }
      },
      (error) => {
        this.message = 'Error uploading image';
      }
    );
  }

  getStatus() {
    this.documentService
      .getDrivingLicenseStatus(this.customerId)
      .subscribe((data: any) => {
        if (data && data.status) {
          this.drivingLicenseStatus = data.status;
        } else {
          this.drivingLicenseStatus = 'NoRecord';
        }
      });
  }

  fetchProducts() {
    const storedItems = localStorage.getItem('singleItem');
    if (storedItems) {
      this.products = JSON.parse(storedItems);
    }
  }

  resetValues() {
    this.selectedFile = undefined;
    this.panId = '';
    this.documentId = '';
  }

  addToCart(product: any) {
    this.service.addToCart(product);
    this.router.navigate(['cart']);
    // this.router.navigate(['vehicleimages']);
  }

  printDates() {
    const startDate = new Date(this.fromDate);
    const endDate = new Date(this.toDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const isWithinRange = this.products.some((item) => {
      const availableFromDate = new Date(item.startDate);
      const availableToDate = new Date(item.endDate);
      availableFromDate.setHours(0, 0, 0, 0);
      availableToDate.setHours(0, 0, 0, 0);
      return startDate >= availableFromDate && endDate <= availableToDate;
    });

    if (!isWithinRange) {
      this.errorMessage = 'Vehicle is not available for selected dates.';
    } else {
      this.errorMessage = '';
      const differenceInTime = endDate.getTime() - startDate.getTime();
      this.numberOfDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      localStorage.setItem('numberOfDays', this.numberOfDays.toString());
      this.selectDriver(''); 
    }
  }

  selectDriver(driver: string) {
    this.selectedDriver = driver;
    this.selectedOption =
      this.selectedDriver === 'Female' || this.selectedDriver === 'Male'
        ? 'driver-service'
        : 'self-driving';

    if (this.selectedOption === 'driver-service') {
      this.totalAmount =
        this.calculateTotal() * this.numberOfDays +
        this.femaleDriverPrice * this.numberOfDays;
      localStorage.setItem('driverCharge', this.femaleDriverPrice.toString());
    } else {
      this.totalAmount = this.calculateTotal() * this.numberOfDays;
      localStorage.setItem('driverCharge', '0');
    }
    localStorage.setItem('totalAmount', this.totalAmount.toString());
  }

  calculateTotal(): number {
    let total = 0;
    for (const product of this.products) {
      total += product.pricePerHour;
    }
    return total;
  }
}
