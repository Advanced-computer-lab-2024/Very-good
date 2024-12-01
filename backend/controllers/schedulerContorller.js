const Tourist = require('../models/touristModel');
const Activity = require('../models/activityModel'); // Adjust the path as needed
const sendEmail = require('./emailController'); // Your email function
const Notification = require ('../models/notificationModel')


const notifyUpcomingActivities = async () => {
    try {
        console.log("Starting the notification process for upcoming activities...");

        // Get the current date and time and adjust to Egypt time (UTC +2)
        const now = new Date();
        const nowInEgypt = new Date(now.getTime() + 2 * 60 * 60 * 1000);  // Add 2 hours to UTC time
        console.log("Current date and time in Egypt time zone:", nowInEgypt);

        // Calculate the cutoff time for the next 24 hours in Egypt time zone
        const cutoffTime = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000); // Add 2 hours to UTC cutoff time
        console.log("Cutoff time for the next 24 hours in Egypt time zone:", cutoffTime);

        // Find all tourists who have booked activities
        const tourists = await Tourist.find({ bookedActivities: { $exists: true, $ne: [] } })
            .populate({
                path: 'bookedActivities',
                model: 'activity', // Referencing the Activity model
                match: { date: { $gte: nowInEgypt, $lte: cutoffTime } }, // Match activities in the next 24 hours
            });
        console.log("Found tourists with booked activities:", tourists.length);

        // Process each tourist
        for (const tourist of tourists) {
            const upcomingActivities = tourist.bookedActivities;
            console.log(`Processing tourist: ${tourist.name}, upcoming activities: ${upcomingActivities.length}`);

            if (upcomingActivities.length > 0) {
                // Create a personalized email body
                const activityDetails = upcomingActivities
                    .map(activity => {
                        const activityTime = `${activity.time.hours}:${String(activity.time.minutes).padStart(2, '0')}`;
                        return `- ${activity.name} at ${activityTime} on ${activity.date.toDateString()} at location (${activity.location.lat}, ${activity.location.lng}).\n`;
                    })
                    .join('\n');

                const emailSubject = `Reminder: Upcoming Activities You've Booked`;
                const emailBody = `
                    Hi ${tourist.name},

                    This is a friendly reminder about your upcoming activities happening within the next 24 hours:

                    ${activityDetails}

                    Thank you for booking with us. Have a great time!

                    Best regards,
                    Your Team`;

                // Send the email
                await sendEmail({
                    to: tourist.email,
                    subject: emailSubject,
                    text: emailBody,
                });

                console.log(`Reminder email sent to ${tourist.email}`);

                const notification = new Notification({
                    targetId: tourist._id, // TourGuide ID from the itinerary
                    targetType: 'Tourist', // Target is the TourGuide
                    subject: 'Reminder: Upcoming Activities',
                    message: `you have an upcoming itinerary : ${activityDetails}`                 
                });
          
                  await notification.save();

                console.log(`Reminder notification sent to ${tourist.email}`);
            }
        }

        console.log("Notification process completed successfully.");
    } catch (error) {
        console.error("Error during notification process:", error);
    }
};

const notifyInterestedTourists = async () => {
    try {
      // Find activities where booking is open
      const openActivities = await Activity.find({ bookingOpen: true });
  
      for (const activity of openActivities) {
        // Iterate through the interested tourists for this activity
        for (const interested of activity.interestedTourists) {
          if (!interested.notified) {
            const tourist = await Tourist.findById(interested.touristId);
  
            if (tourist) {
              // Send email notification to the tourist
              const emailSubject = `Bookings are now open for ${activity.name}!`;
              const emailBody = `
                Hi ${tourist.name},
  
                Great news! Bookings are now open for the activity "${activity.name}".
  
                Best regards,
                Your Team
              `;
  
              await sendEmail({
                to: tourist.email,
                subject: emailSubject,
                text: emailBody,
              });
  
              console.log(`Notified ${tourist.email} about ${activity.name}`);

              const notification = new Notification({
                targetId: tourist._id, // TourGuide ID from the itinerary
                targetType: 'Tourist', // Target is the TourGuide
                subject: `Bookings are now open for ${activity.name}!`,
                message: `We Look forward to seeing you in ${activity.name}!`                 
                });
      
              await notification.save();

            console.log(`Reminder notification sent to ${tourist.email}`);
  
              // After notifying the tourist, update their notified status in the activity document
              const updatedActivity = await Activity.findByIdAndUpdate(
                activity._id,
                {
                  $set: {
                    'interestedTourists.$[elem].notified': true
                  }
                },
                {
                  arrayFilters: [{ 'elem.touristId': interested.touristId }],
                  new: true,
                }
              );

            }
          }
        }
      }
    } catch (error) {
      console.error('Error in notifying users:', error);
    }
  };

module.exports = { notifyUpcomingActivities, notifyInterestedTourists};
