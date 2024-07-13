import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import ollama from 'ollama'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private roleBob: string = 'You are Bob. You are an expert Java developer. ' +
    'Do not mention your role or name. Answer in short sentences. You are talking to Alice, a Product Owner';
    // 'You are having a chat and are answering to the following: ';
  private roleAlice: string = 'You are Alice. You are an expert Product Owner. You are talking to Bob, a Java Developer'+
    'Do not mention your role or name. Answer in short sentences. ';
    // 'You are having a chat and are answering to the following: ';

  protected status: string = 'idle';

  protected instructions: string = '';
  protected response: string = '';

  startDebate() {
    this.sendMessageAlice();
  }

  async sendMessageAlice() {
    const response = await this.getOllamaResponse('Alice', this.roleAlice);
    this.response = response.message.content;
    this.addMessage('Alice: ' + this.response);
    this.sendMessageBob();
  }

  async sendMessageBob() {
    const response = await this.getOllamaResponse('Bob', this.roleBob);
    this.response = response.message.content;
    this.addMessage('Bob: ' + this.response);
    this.sendMessageAlice();
  }

  private async getOllamaResponse(name: string, role: string) {
    this.status = name + ' is typing...';
    return await ollama.chat({
      model: 'llama3',
      messages: [{role: 'user', content: role + ' ' + this.instructions + ' ' + this.response}],
    });
  }

  private addMessage(message: string) {
    let ul = document.getElementById('messages');
    let li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerText = message;
    // @ts-ignore
    ul.appendChild(li);
  }


}
