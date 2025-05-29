import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );

    last12Months.push({
      month: date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      count: 0,
    });
  }

  const monthCounts = await Promise.all(
    last12Months.map(async ({ month }) => {
      const [monthStr, yearStr] = month.split(" ");
      const monthIndex = new Date(`${monthStr} 1, ${yearStr}`).getMonth();
      const year = parseInt(yearStr);

      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

      const count = await model.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      });

      return { month, count };
    })
  );

  return { last12Months: monthCounts };
}
