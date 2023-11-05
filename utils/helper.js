import moment from "moment";

export const getInstallmentsPerYear = (installmentType) => {
  switch (installmentType) {
    case "Monthly":
      return 12;
    case "Quarterly":
      return 4;
    case "Annual":
      return 1;
    // Add handling for Custom type
    default:
      return 0;
  }
};

export const createInstallments = (
  duration,
  startDate,
  installmentType,
  installmentAmount,
  installmentsPerYear
) => {
  let installments = [];
  let currentDate = moment(startDate, "MM/DD/YYYY");
  console.log("currentDate: ", currentDate);

  if (
    duration > 0 &&
    startDate &&
    installmentType !== "custom" &&
    installmentAmount > 0 &&
    installmentsPerYear > 0
  ) {
    for (let i = 0; i < duration * installmentsPerYear; i++) {
      installments.push({
        installmentNumber: i + 1,
        installmentDate: currentDate.format("YYYY-MM-DD"),
        amount: Math.round(installmentAmount * 1000) / 1000,
      });

      if (installmentsPerYear === 12) {
        currentDate.add(1, "months");
      } else if (installmentsPerYear === 4) {
        currentDate.add(3, "months");
      }
    }
  }

  return installments;
};

export const checkDate = (value, helper, shareDetails) => {
  const dateToCompare = moment(value, "YYYY-MM-DD");

  const fixedDate = moment(shareDetails?.startDate, "YYYY-MM-DD");

  const instalmentEndDate = fixedDate
    .clone()
    .add(shareDetails?.duration, "years");

  if (dateToCompare.isBefore(fixedDate)) {
    return helper.message(`dateToCompare is before fixedDate${dateToCompare}`);
  }
  if (dateToCompare.isAfter(instalmentEndDate)) {
    return helper.message(`dateToCompare is after fixedDate${dateToCompare}`);
  }
  return value;
};

export const validateTotalAmount = (value, helpers, shareDetails) => {
  const totalArrayAmount = value.reduce((acc, item) => acc + item.amount, 0);

  if (totalArrayAmount !== shareDetails?.totalInstallmentAmount) {
    return helpers.message(
      'The total amount of installments does not match the "totalinstallmentamount" field in the document.'
    );
  }
  return value;
};
