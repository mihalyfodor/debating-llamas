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

  private promptFrame: string = ' Do not mention your role or name. Answer in short sentences. You are talking to ';

  protected roleBob: string = 'You are Bob. You are an expert Java developer. You are making sure that the software is implemented correctly.';
  protected roleAlice: string = 'You are Alice. You are an expert Product Owner. You are making sure that the software covers the domain in discussion.';

  private contextBob: number[] = [];
  private contextAlice: number[] = [];

  protected status: string = 'idle';

  protected instructions: string = '';
  protected response: string = '';

  startDebate() {
    this.sendMessageAlice();
  }

  async sendMessageAlice() {
    const response = await this.getOllamaResponse('Alice', this.roleAlice  + this.promptFrame + ' Bob');
    this.response = response.response;
    this.contextAlice = response.context;
    this.addMessage('Alice: ' + this.response);
    this.sendMessageBob();
  }

  async sendMessageBob() {
    const response = await this.getOllamaResponse('Bob', this.roleBob + this.promptFrame + ' Alice');
    this.response = response.response;
    this.contextBob = response.context;
    this.addMessage('Bob: ' + this.response);
    this.sendMessageAlice();
  }

  private async getOllamaResponse(name: string, role: string) {
    this.status = name + ' is typing...';
    return await ollama.generate({
      model: 'llama3',
      prompt: role + ' ' + this.instructions + ' ' + this.response,
      context: name === 'Alice' ? this.contextAlice : this.contextBob,
      stream: false,
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
