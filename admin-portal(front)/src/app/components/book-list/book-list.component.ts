import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { GetBookListService } from '../../services/get-book-list.service';
import { RemoveBookService } from '../../services/remove-book.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

	private selectedBook: Book;
	private checked: boolean;
	private bookList: Book[];
	private allChecked: boolean;
	private removeBookList: Book[] = new Array();

  constructor(
  		private getBookListService: GetBookListService,
  		private router: Router,
      private removeBookService: RemoveBookService,
      private dialog: MatDialog
  	) { }

  onSelect(book:Book) {
    this.selectedBook = book;
    this.router.navigate(['/viewBook', this.selectedBook.id]);
  }

  openDialog(book:Book) {
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(
      res => {
        console.log(res);
        if (res == "yes") {
          this.removeBookService.sendBook(book.id).subscribe(
            res => {
              console.log(res);
              this.getBookList();
            },
            err => {
              console.log(err);
            }
          );
        }
      }
    );
  }

  removeSelectedBooks() {
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(
      res => {
        console.log(res);
        if (res == "yes") {
          for (let book of this.removeBookList) {
            this.removeBookService.sendBook(book.id).subscribe(
            res => {
              console.log(res);
            },
            err => {
              console.log(err);
            });
          }
          location.reload();
        }
      });
  }

  updateRemoveBookList(checked:boolean, book:Book) {
    if(checked) {
      this.removeBookList.push(book);
    } else {
      this.removeBookList.splice(this.removeBookList.indexOf(book), 1);
    }
  }

  updateSelected(checked: boolean) {
    if (checked) {
      this.allChecked = true;
      this.removeBookList = this.bookList.slice();
    } else {
      this.allChecked = false;
      this.removeBookList = [];
    }
  }
  
  getBookList() {
    this.getBookListService.getBookList().subscribe(
        res => {
          console.log(res.json());
          this.bookList = res.json();
        }, 
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
  	this.getBookList();
  }

}

@Component({
  selector: 'dialog-result-example-dialog',
  templateUrl: './dialog-result-example-dialog.html'
})
export class DialogResultExampleDialog {
  constructor(private dialogRef: MatDialogRef<DialogResultExampleDialog>) {}
}
