import {HttpResponse} from '@angular/common/http';
import JsonUtils from '../utils/app.utils';

export class ServiceResponse {
  private readonly success: boolean;
  public isSuccess(): boolean {
    return this.success;
  }
  public isFailure(): boolean {
    return !this.isSuccess();
  }

  private readonly response?: HttpResponse<any>;
  public getResponse(): HttpResponse<any> {
    return this.response;
  }
  public getData(): any {
    if (!this.getResponse() || !this.getResponse().body) {
      return null;
    }
    return JsonUtils.parseResponseJson(this.getResponse().body);
  }

  private redirect?: any;
  public getRedirect(): any {
    return this.redirect;
  }
  public setRedirect(redirect?: any) {
    this.redirect = redirect;
  }

  private readonly errors: string[];
  public getErrors(): string[] {
    return this.errors;
  }

  private readonly messages: string[];
  public getMessages(): string[] {
    return this.messages;
  }

  constructor(success: boolean, response?: HttpResponse<any>, redirect?: any, errors?: any, messages?: any) {
    this.success = success;
    this.response = response;
    this.setRedirect(redirect);
    this.errors = errors;
    this.messages = messages;
  }
}
