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
  installmentAmount,
  installmentsPerYear
) => {
  let installments = [];
  let currentDate = moment(startDate, "MM/DD/YYYY");

  if (
    duration > 0 &&
    startDate &&
    installmentAmount > 0 &&
    installmentsPerYear > 0
  ) {
    for (let i = 0; i < duration * installmentsPerYear; i++) {
      installments.push({
        installmentNumber: i + 1,
        installmentDate: currentDate.format("YYYY-MM-DD"),
        amount: installmentAmount,
      });

      // Increment the date based on installment type
      if (installmentsPerYear === 12) {
        currentDate.add(1, "months");
      } else if (installmentsPerYear === 4) {
        currentDate.add(3, "months");
      }
      // Handle other installment types as needed
    }
  }

  return installments;
};
