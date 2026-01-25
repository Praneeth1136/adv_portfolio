import { mapEach } from "../utils/dom";
import Component from "../classes/Component";

export default class Time extends Component {
  constructor() {
    super({
      element: "body",
      elements: {
        hour: "[data-hour]",
        minute: "[data-minute]",
      },
    });

    this.updateTime();

    this.oldHour = this.formattedTime.hourValue;
    this.oldMinute = this.formattedTime.minuteValue;

    setInterval(this.updateTime, 1000);
  }

  get currentTime() {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: false, // Ensures 24-hour format if preferred, or remove for 12-hour
      timeZone: "Asia/Kolkata", // CHANGED FROM Europe/London to Asia/Kolkata
    };

    const time = new Intl.DateTimeFormat("en-US", {
      ...options,
      hour12: false // Force 24-hour format so the split(':') works reliably without AM/PM
    }).format(new Date());

    return time;
  }

  get formattedTime() {
    const time = this.currentTime;
    // This logic expects a format like "14:30" to split correctly
    const timeArray = time.split(":");
    const hourValue = timeArray[0];
    const minuteValue = timeArray[1];

    return {
      hourValue,
      minuteValue,
    };
  }

  updateTime() {
    const { hour, minute } = this.elements;
    const { hourValue, minuteValue } = this.formattedTime;

    mapEach(hour, (element) => {
      if (this.oldHour !== hourValue) {
        element.classList.add("flash");
        setTimeout(() => {
          element.innerHTML = hourValue;
        }, 500);

        setTimeout(() => {
          element.classList.remove("flash");
        }, 1000);
      }
    });

    mapEach(minute, (element) => {
      if (this.oldMinute !== minuteValue) {
        element.classList.add("flash");

        setTimeout(() => {
          element.innerHTML = String(minuteValue).slice(0, 2);
        }, 500);

        setTimeout(() => {
          element.classList.remove("flash");
        }, 1000);
      }
    });

    this.oldHour = hourValue;
    this.oldMinute = minuteValue;
  }
}