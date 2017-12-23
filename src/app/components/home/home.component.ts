import { Component, OnInit } from '@angular/core';
import { identifierModuleUrl } from '@angular/compiler';

declare let Zone: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  electron: any;

  shortcutEnabled = false;
  shortcutZone: any;

  quitEnabled = false;
  quitZone: any;

  iconZone: any;

  captureZone: any;

  dialogZone: any;

  menuEnabled = false;
  menuZone: any;

  shellZone: any;

  constructor() { }

  ngOnInit() {
    this.electron = (window as any).electron;
    if (!this.electron.remote.app) {
      return;
    }
    this.electron.remote.app.on('will-quit', (event: any) => {
      if (this.quitEnabled) {
        event.preventDefault();
        this.quitZone = Zone.current.name;
      }
    });
  }

  shortcut() {
    if (!this.electron.remote.globalShortcut) {
      return;
    }
    this.shortcutEnabled = !this.shortcutEnabled;
    const globalShortcut = this.electron.remote.globalShortcut;
    if (this.shortcutEnabled) {
      const ret = globalShortcut.register('CommandOrControl+Y', () => {
        this.shortcutZone = Zone.current.name;
      });
      console.log('ret', ret);
    } else {
      this.shortcutZone = '';
      globalShortcut.unregister('CommandOrControl+Y');
    }
  }

  preventQuit() {
    this.quitEnabled = !this.quitEnabled;
  }

  getFileIcon() {
    if (!this.electron.remote.app) {
      return;
    }
    this.electron.remote.app.getFileIcon('', () => {
      this.iconZone = Zone.current.name;
    });
  }

  capture() {
    if (!this.electron.desktopCapturer) {
      return;
    }
    this.electron.desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
      this.captureZone = Zone.current.name;
    });
  }

  dialog() {
    if (!this.electron.remote.dialog) {
      return;
    }
    this.electron.remote.dialog.showMessageBox({type: 'info'}, () => {
      this.dialogZone = Zone.current.name;
    });
  }

  menu() {
    if (!this.electron.remote.Menu) {
      return;
    }
    if (!this.menuEnabled) {
      this.menuEnabled = !this.menuEnabled;
    } else {
      return;
    }
    const template = [{
      label: 'Edit',
      submenu: [
        {
          label: 'submenu',
          click: () => {
            this.menuZone = Zone.current.name;
          }
        },
      ]
    }];
    const menu = this.electron.remote.Menu.buildFromTemplate(template);
    this.electron.remote.Menu.setApplicationMenu(menu);
  }

  shell() {
    if (!this.electron.shell) {
      return;
    }
    this.electron.shell.openExternal('https://www.github.com', {activate: true}, () => {
      this.shellZone = Zone.current.name;
    });
  }
}
