import mongoose from "mongoose";
import { Product } from "../models/products.models.js";

// Category translation mapping
const categoryTranslations = {
  "Granule Products": "ग्रॅन्युल उत्पादने",
  "Liquid Products": "द्रव उत्पादने",
};

/**
 * Migration script to convert existing products from single-language to bilingual format
 * Run this script once to migrate existing data
 */
export const migrateProducts = async () => {
  try {
    console.log("Starting product migration...");

    const products = await Product.find({});

    let migratedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      // Already migrated
      if (typeof product.name === "object" && product.name.en) {
        console.log(`Product ${product._id} already migrated, skipping...`);
        skippedCount++;
        continue;
      }

      // Old schema (string)
      if (typeof product.name === "string") {
        try {
          await Product.updateOne(
            { _id: product._id },
            {
              $set: {
                "name.en": product.name,
                "name.mr": product.name, // placeholder
                "description.en": product.description,
                "description.mr": product.description, // placeholder
                "category.en": product.category,
                "category.mr":
                  categoryTranslations[product.category] || product.category,
              },
            }
          );

          console.log(
            `Migrated product: ${product._id} - ${product.name}`
          );
          migratedCount++;
        } catch (err) {
          console.error(
            `Error migrating product ${product._id}:`,
            err.message
          );
        }
      }
    }

    console.log("\n=== Migration Complete ===");
    console.log(`Total products processed: ${products.length}`);
    console.log(`Successfully migrated: ${migratedCount}`);
    console.log(`Skipped (already migrated): ${skippedCount}`);
    console.log("===========================\n");

    return {
      total: products.length,
      migrated: migratedCount,
      skipped: skippedCount,
    };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

// Allow running as standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  const dbUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/agriculture";

  mongoose
    .connect(dbUri)
    .then(() => {
      console.log("Connected to MongoDB");
      return migrateProducts();
    })
    .then((result) => {
      console.log("Migration result:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration error:", error);
      process.exit(1);
    });
}
