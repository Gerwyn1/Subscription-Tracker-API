import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const reminders = [
  { label: "7 days before reminder", daysBefore: 7 },
  { label: "5 days before reminder", daysBefore: 5 },
  { label: "2 days before reminder", daysBefore: 2 },
  { label: "1 day before reminder", daysBefore: 1 },
  { label: "Final day reminder", daysBefore: 0 },
];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription) {
    console.error("Subscription not found");
    return;
  }

  if (subscription.status !== "active") {
    console.log(
      `Subscription "${subscription.name}" is not active. Stopping workflow.`
    );
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`
    );
    return;
  }

  for (const daysBefore of reminders) {
    const reminderDate = renewalDate.subtract(daysBefore.daysBefore, "day");
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate)
    }

    await triggerReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder`);
    // Send email, SMS, push notification, etc.
  })
};