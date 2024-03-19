import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import { ResetPassWord } from 'src/app/models/reset-password.model';
import ValidateForm from '../../helpers/validateform';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassWord();

  constructor(private fb:FormBuilder, private router: Router , private toast: NgToastService, private activatedRoute: ActivatedRoute, private resetService: ResetPasswordService ) {


  }
  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },{
      validator: ConfirmPasswordValidator("password","confirmPassword")
    });

    this.activatedRoute.queryParams.subscribe(val=>{
      this.emailToReset = val['email'];
      let uriToken = val['code'];

      this.emailToken = uriToken.replace(/ /g,'+');
      console.log(this.emailToken);
      console.log(this.emailToReset);
    })
  }

  reset(){
    if(this.resetPasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetService.resetPassWord(this.resetPasswordObj)
      .subscribe({
        next:(res)=>{
          this.toast.success({
            detail: 'SUCESS',
            summary: "Password Reset Successfully",
            duration: 3000,
          });
          this.router.navigate(['/login'])
        },
        error:(err)=>{
          this.toast.error({
            detail: 'ERROR',
            summary: "Something went wrong!!",
            duration: 3000,
          });
        }
      })
    }else{
      ValidateForm.validateAllFormFileds(this.resetPasswordForm);
    }
  }
}
