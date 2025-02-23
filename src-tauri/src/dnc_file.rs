use crate::final_file::{read_csv_to_phone_map, filter_dnc_numbers};
use std::fs;
use std::path::Path;
use std::error::Error;
use regex::Regex;
use csv::WriterBuilder;


pub fn generate_dnc_file(output_dir: &str, source_file: &str) -> Result<(), Box<dyn Error>> {
    let extracted_file_pattern = Regex::new(r"extractedNumbers_\d+_\d+_\d+\.csv")?;
    let extracted_file = fs::read_dir(output_dir)?
        .filter_map(Result::ok)
        .filter_map(|entry| {
            let file_name = entry.file_name().into_string().ok()?;
            if extracted_file_pattern.is_match(&file_name) {
                Some(format!("{}\\{}", output_dir, file_name))
            } else {
                None
            }
        })
        .next()
        .ok_or("No extractedNumbers file found")?;


    // Final file format
    let source_file_name = Path::new(source_file)
    .file_name()
    .unwrap_or_default()
    .to_str()
    .unwrap_or_default();

    let final_output_file = format!("{}\\DNC_{}", output_dir, source_file_name.replace("Source_", ""));

    // Other File Paths
    let all_clean_file = format!("{}\\all_clean.csv", output_dir);
    let fdnc_file = format!("{}\\federal_dnc.csv", output_dir);
    let invalid_file = format!("{}\\invalid.csv", output_dir);
    let no_carrier_file = format!("{}\\no_carrier.csv", output_dir);

    // println!("Attempting to open all_clean file: {}", all_clean_file);
    // println!("Attempting to open federal_dnc file: {}", fdnc_file);
    // println!("Attempting to open invalid file: {}", invalid_file);
    // println!("Attempting to open no_carrier file: {}", no_carrier_file);
    // println!("Attempting to create final output file: {}", final_output_file);
   

    // Hashmaps
    let fdnc = read_csv_to_phone_map(&fdnc_file)?;
    let invalid = read_csv_to_phone_map(&invalid_file)?;
    let no_carrier = read_csv_to_phone_map(&no_carrier_file)?;
    let dnc = filter_dnc_numbers(&extracted_file, &all_clean_file, &fdnc_file, &invalid_file)?;

    // Flattening the values from each collection (values from the hashmaps)
    let fdnc: Vec<String> = fdnc.keys().cloned().collect();
    let dnc: Vec<String> = dnc.keys().cloned().collect();
    let invalid: Vec<String> = invalid.keys().cloned().collect();
    let no_carrier: Vec<String> = no_carrier.keys().cloned().collect();

    // Open Writer
    let mut wtr = WriterBuilder::new().from_path(&final_output_file)?;
    wtr.write_record(&["FDNC", "DNC", "Invalid", "No Carrier"])?;

    // Preparing rows
    let max_rows = fdnc.len()
        .max(dnc.len())
        .max(invalid.len())
        .max(no_carrier.len());

        for i in 0..max_rows {
            let mut row = vec![""; 4];  // Initialize the row with empty values
        
            // Fill the row with values from the corresponding columns (if available)
            if i < fdnc.len() {
                row[0] = &fdnc[i];
            }
            if i < dnc.len() {
                row[1] = &dnc[i];
            }
            if i < invalid.len() {
                row[2] = &invalid[i];
            }
            if i < no_carrier.len() {
                row[3] = &no_carrier[i];
            }
        
            // Write the row to the CSV
            wtr.write_record(&row)?;
        }
    println!("Final report generated at '{}'", final_output_file);
    Ok(())
}