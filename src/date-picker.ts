import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createPopper, Instance } from '@popperjs/core';

@customElement('date-picker')
export class MyElement extends LitElement {
  @property({ type: String })
  private selectedDate = '';

  @property({ type: String })
  private divId = 'my-div';

  @property({ type: String })
  private buttonId = 'my-button';

  @property({ type: String })
  isPopperVisible = false;

  private _showPopper() {
    const input = this.shadowRoot?.querySelector(`#${this.divId}`) as HTMLInputElement;
    const button = this.shadowRoot?.querySelector(`#${this.buttonId}`) as HTMLButtonElement;

    this.isPopperVisible = true;

    // Create a new Popper instance
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

    // Show the popper
    popper.update();
  }

  private _hidePopper() {
    this.isPopperVisible = false;
  }

  private _onDateSelected(e: Event) {
    const dateInput = e.target as HTMLInputElement;
    const selectedDate = dateInput.value;
    this.selectedDate = selectedDate;
    this._hidePopper();
  }

  private _renderDatePicker() {
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth() + 1;
    let daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    let daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
    const updateCalendar = (year: number, month: number) => {
      currentYear = year;
      currentMonth = month;
      daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      this.requestUpdate();
    };
  
    const onMonthChange = (delta: number) => {
      const newMonth = currentMonth + delta;
      if (newMonth < 1) {
        updateCalendar(currentYear - 1, 12);
      } else if (newMonth > 12) {
        updateCalendar(currentYear + 1, 1);
      } else {
        updateCalendar(currentYear, newMonth);
      }
    };
  
    const onYearChange = (delta: number) => {
      const newYear = currentYear + delta;
      updateCalendar(newYear, currentMonth);
    };
  
    const onDayClick = (day: number) => {
      const newDate = new Date(currentYear, currentMonth - 1, day);
      const formattedDate = newDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      const input = this.shadowRoot?.querySelector(`#${this.divId} input`) as HTMLInputElement;
      input.value = formattedDate;
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this._hidePopper();
    };
  
    return html`
      <div class="date-picker">
        <div class="month-year">
          <button class="prev-year" @click="${() => onYearChange(-1)}">&lt;&lt;</button>
          <button class="prev-month" @click="${() => onMonthChange(-1)}">&lt;</button>
          <div class="month">${currentMonth}</div>
          <div class="year">${currentYear}</div>
          <button class="next-month" @click="${() => onMonthChange(1)}">&gt;</button>
          <button class="next-year" @click="${() => onYearChange(1)}">&gt;&gt;</button>
        </div>
        <div class="days">
          ${daysArray.map(
            (day) => html`<button class="day" @click="${() => onDayClick(day)}">${day}</button>`
          )}
        </div>
      </div>
    `;
  }
  
  

  render() {
    return html`
      <div class="input-container" id="${this.divId}">
        <input type="text" placeholder="MM/DD/YYYY" />
        <button id="${this.buttonId}" @click="${this._showPopper}">
          <svg>
            <path d="M19,3H17V1h-2v2H9V1H7v2H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M5,8h14v2H5V8z M5,12h14v2H5V12z M5,16h9v2H5V16z"/>
          </svg>
        </button>
      </div>
      ${this.isPopperVisible
        ? html`<div class="popper">
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

    /* Style the popper */
    .popper {
      background-color: white;
      border: 1px solid black;
      padding: 8px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'date-picker': MyElement
  }
}
