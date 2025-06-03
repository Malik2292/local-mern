const TierThreeInfoGeneratorTwo = (
  applications = [],
  deliveryWaitTime = 15,
  tierTwoId,
  circleActiveTime
) => {
  const info = [];
  let deliveryTime = null;
  let position = 0;

  applications?.forEach((app) => {
    const isClaimedRemaining = app?.interviewers?.find(
      (int) => int.isClaimed === false && int?.isActive === true
    );
    const basicInfo = {
      _id: app?._id,
      memberID: app?.memberID,
      priceRange: app?.priceRange,
      state: app?.state,
      military: app?.military,
      primaryLanguage: app?.primaryLanguage,
      speciality: app?.speciality,
      preferredContactMethod: app?.preferredContactMethod,
      notes: app?.notes,
      referee: app?.referee,
      createdAt: app?.createdAt,
      updatedAt: app?.updatedAt,
      currentUserInfo: app?.currentUserInfo,
    };

    let sendingInfo = basicInfo;

    const sortedInterviewers =
      app?.interviewers
        ?.filter((i) => i.isActive && i.isClaimed)
        .sort((a, b) => a.claimedAt - b.claimedAt) || [];
    const currentUserIndex = sortedInterviewers?.findIndex(
      (si) => si?._id?.toString() === tierTwoId?.toString()
    );
    if (currentUserIndex > -1) {
      position = 1 + currentUserIndex;
    }

    if (!isClaimedRemaining) {
      const circleActiveTimes = sortedInterviewers.map((interviewer, index) => {
        const waitingTime = deliveryWaitTime * index;
        const waitingTimeInMS = waitingTime * 60000;
        const lastClaimedAt =
          sortedInterviewers[
            sortedInterviewers?.length - 1
          ]?.claimedAt?.getTime();
        const finalizedTime = lastClaimedAt + waitingTimeInMS;
        const approvalTime = new Date(finalizedTime + circleActiveTime * 60000);
        const approvalTimeString = approvalTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return {
          _id: interviewer._id,
          circleActiveTime: approvalTimeString,
        };
      });

      const waitingTime = deliveryWaitTime * currentUserIndex;
      const waitingTimeInMS = waitingTime * 60000;
      const lastClaimedAt =
        sortedInterviewers[
          sortedInterviewers?.length - 1
        ]?.claimedAt?.getTime();
      const finalizedTime = lastClaimedAt + waitingTimeInMS;
      deliveryTime = new Date(finalizedTime);

      const currentTime = Date.now();
      const timeDiff = currentTime - finalizedTime;
      if (timeDiff > 0) {
        app.interviewers = app.interviewers
          .filter((inter) => inter.isActive && inter.isClaimed)
          .sort((a, b) => a.claimedAt - b.claimedAt);
        sendingInfo = app;
        info.push(sendingInfo);
      } else {
        info.push(sendingInfo);
      }
    } else {
      info.push(sendingInfo);
    }
  });

  return { info, deliveryTime, position };
};

module.exports = {
  TierThreeInfoGeneratorTwo,
};
