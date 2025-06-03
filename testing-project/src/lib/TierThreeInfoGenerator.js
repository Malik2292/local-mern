const TierThreeInfoGenerator = (
  applications = [],
  deliveryWaitTime = 15,
  tierTwoId
) => {
  const info = [];
  applications?.forEach((app) => {
    const isClaimedRemaining = app?.interviewers?.find(
      (int) => int.isClaimed === false && int?.isActive === true
    );

    const basicInfo = {
      _id: app?._id,
      state: app?.state,
      military: app?.military,
      priceRange: app?.priceRange,
      applicationType: app?.applicationType,
      speciality: app?.speciality,
      status: app?.status,
      userType: app?.userType,
      referee: app?.referee,
      createdAt: app?.createdAt,
      updatedAt: app?.updatedAt,
      currentUserInfo: app?.currentUserInfo,
      interviewers: app?.interviewers,
    };

    if (!isClaimedRemaining) {
      const sortedInterviewers =
        app?.interviewers?.sort((a, b) => a.claimedAt - b.claimedAt) || [];

      const currentUserIndex = sortedInterviewers?.findIndex(
        (si) => si?._id?.toString() === tierTwoId?.toString()
      );
      const waitingTime = deliveryWaitTime * currentUserIndex;
      const waitingTimeInMS = waitingTime * 60000;
      const lastClaimedAt =
        sortedInterviewers[
          sortedInterviewers?.length - 1
        ]?.claimedAt?.getTime();
      const finalizedTime = lastClaimedAt + waitingTimeInMS;
      const currentTime = Date.now();

      const timeDiff = currentTime - finalizedTime;
      if (timeDiff < 0) {
        info.push(basicInfo);
      } else {
        info.push(app);
      }
    } else {
      info.push(basicInfo);
    }
  });
  return info;
};

module.exports = {
  TierThreeInfoGenerator,
};
