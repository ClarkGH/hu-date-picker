import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createPopper, Instance } from '@popperjs/core';

@customElement('date-picker')
export class MyElement extends LitElement {
  @property({ type: String })
  selectedDate = '';

  @property({ type: String })
  private selectedYear = new Date().getFullYear();

  @property({ type: String })
  private selectedMonth = new Date().getMonth() + 1;

  @property({ type: String })
  private divId = 'my-div';

  @property({ type: String })
  private buttonId = 'my-button';

  @property({ type: Boolean })
  isPopperVisible = false;
  
  @property({ type: Boolean })
  isFieldValid = false;

  private _showPopper() {
    const input = this.shadowRoot?.querySelector(`#${this.divId}`) as HTMLInputElement;
    const button = this.shadowRoot?.querySelector(`#${this.buttonId}`) as HTMLButtonElement;

    this._togglePopper();

    const popper: Instance = createPopper(input, button.nextElementSibling as HTMLElement, {
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    popper.update();
  }

  private _togglePopper() {
    this.isPopperVisible = !this.isPopperVisible;
  }

  private _onInputBlur(e: FocusEvent) {
    const input = e.target as HTMLInputElement;
    const value = input.value.trim();
    const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
  
    if (!pattern.test(value)) {
      console.error('Invalid date format. Please enter a date in the format MM/DD/YYYY');
      input.value = '';
    } else {
      this.selectedDate = value;
      this.isFieldValid = true;
    }
  }

  private _onMonthChange(e: Event) {
    this.selectedMonth = parseInt((e.target as HTMLSelectElement).value);
  }
  
  private _onYearChange(e: Event) {
    this.selectedYear = parseInt((e.target as HTMLSelectElement).value);
  }

  private _onDaySelect(e: Event) {
    const day = (e.target as HTMLDivElement).textContent;
    this.selectedDay = parseInt(day || '');
    const date = new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay);
    this.selectedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }  

  private _renderDatePicker() {
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const monthOptions = monthNames.map((month, index) => {
      return html`
        <option value="${index + 1}">${month}</option>
      `;
    });
  
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    const startYear = currentYear - 500;
    const endYear = currentYear + 500;
  
    for (let i = startYear; i <= endYear; i++) {
      if (i === currentYear) {
        yearOptions.push(html`
          <option value="${i}" selected>${i}</option>
        `);
      } else {
        yearOptions.push(html`
          <option value="${i}">${i}</option>
        `);
      }
    }
  
    const weeksInMonth = Math.ceil(daysInMonth / 7);
    const daysGrid = [];
  
    // loop through the days of the month and create a div element for each day
    for (let day of daysArray) {
      const date = new Date(this.selectedYear, this.selectedMonth - 1, day);
      const dayOfWeek = date.getDay();
  
      // add empty div elements to fill in the days before the first day of the month
      if (day === 1) {
        for (let i = 0; i < dayOfWeek; i++) {
          daysGrid.push(html`<div></div>`);
        }
      }
  
      daysGrid.push(html`<div class="day" @click="${this._onDaySelect}">${day}</div>`);
  
      // add empty div elements to fill in the days after the last day of the month
      if (day === daysInMonth) {
        for (let i = dayOfWeek + 1; i <= 6; i++) {
          daysGrid.push(html`<div></div>`);
        }
      }
    }
  
    return html`
      <div class="date-picker">
        <div class="month-year__picker">
          <select @change="${this._onMonthChange}">${monthOptions}</select>
          <select @change="${this._onYearChange}">${yearOptions}</select>
        </div>
        <div class="day__picker">
        <div class="week">
          <div class="day">Sun</div>
          <div class="day">Mon</div>
          <div class="day">Tue</div>
          <div class="day">Wed</div>
          <div class="day">Thu</div>
          <div class="day">Fri</div>
          <div class="day">Sat</div>
          ${daysGrid}
        </div>
      </div>
      </div>
    `;
  }  
  
  render() {
    return html`
      <div class="input-container" id="${this.divId}">
        <input type="text" placeholder="MM/DD/YYYY" .value="${this.selectedDate}" @blur="${this._onInputBlur}" />
        <button id="${this.buttonId}" @click="${this._showPopper}">
          <svg>
            <path d="M19,3H17V1h-2v2H9V1H7v2H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M5,8h14v2H5V8z M5,12h14v2H5V12z M5,16h9v2H5V16z"/>
          </svg>
        </button>
      </div>
      ${this.isPopperVisible
        ? html`<div>
          ${this._renderDatePicker()}
        </div>`
        : ''}
    `;
  }  

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width 400px;
    }

    .input-container {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    input {
      flex: 1;
      padding-right: 32px;
      width: 280px;
    }

    button {
      background: transparent;
      border: none;
      padding: 4px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 32px;
    }

    svg {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }

    .popper {
      background-color: white;
      border: 1px solid black;
      padding: 8px;
    }

    .date-picker {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      width: 400px;
      padding: 8px;
      border: 1px solid black;
    }

    .month-year__picker {
      display: flex;
      justify-content: space-between;
    }

    .day__picker {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    
    .week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(100px, auto);
    }
    
    .day {
      border: 1px solid black;
      padding: 10px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'date-picker': MyElement
  }
}
