// lib/predictSales.ts
import * as tf from "@tensorflow/tfjs";

/**
 * Predict future sales based on past daily sales numbers.
 * @param salesHistory - Array of daily sales figures
 * @param daysToPredict - Number of future days to predict (default 7)
 * @returns Predicted sales for each future day
 */
export async function predictSales(
  salesHistory: number[],
  daysToPredict: number = 7
): Promise<number[]> {
  const days = salesHistory.map((_, idx) => idx);
  const sales = salesHistory;

  const xs = tf.tensor2d(days, [days.length, 1]);
  const ys = tf.tensor2d(sales, [sales.length, 1]);

  const model = tf.sequential();
  model.add(
    tf.layers.dense({ inputShape: [1], units: 10, activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  await model.fit(xs, ys, { epochs: 100 });

  const futureDays = tf.tensor2d(
    Array.from({ length: daysToPredict }, (_, i) => days.length + i),
    [daysToPredict, 1]
  );

  const prediction = model.predict(futureDays) as tf.Tensor;
  const predictedSales = (await prediction.array()) as number[][];

  return predictedSales.flat();
}
