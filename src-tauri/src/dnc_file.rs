use crate::final_file::{read_csv_to_phone_map, filter_dnc_numbers};
use std::fs;
use std::path::Path;
use std::error::Error;
use regex::Regex;
use csv::WriterBuilder;
use std::collections::HashMap;


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

    // Hashmaps
    let fdnc: HashMap<String, u32> = read_csv_to_phone_map(&fdnc_file)?;
    let invalid: HashMap<String, u32> = read_csv_to_phone_map(&invalid_file)?;
    let no_carrier: HashMap<String, u32> = read_csv_to_phone_map(&no_carrier_file)?;
    let dnc: HashMap<String, u32> = filter_dnc_numbers(&extracted_file, &all_clean_file, &fdnc_file, &invalid_file)?;

    // Function to expand phone numbers based on their counts
    let expand_phone_numbers = |map: &HashMap<String, u32>| -> Vec<String> {
        let mut expanded = Vec::new();
        for (phone_number, count) in map {
            for _ in 0..*count {
                expanded.push(phone_number.clone());
            }
        }
        expanded
    };

    // Expand phone numbers for each category
    let fdnc_expanded = expand_phone_numbers(&fdnc);
    let dnc_expanded = expand_phone_numbers(&dnc);
    let invalid_expanded = expand_phone_numbers(&invalid);
    let no_carrier_expanded = expand_phone_numbers(&no_carrier);

    // Determine the maximum length of the columns
    let max_len = vec![fdnc_expanded.len(), dnc_expanded.len(), invalid_expanded.len(), no_carrier_expanded.len()]
        .into_iter()
        .max()
        .unwrap_or(0);

    // Open Writer
    let mut wtr = WriterBuilder::new().from_path(&final_output_file)?;
    wtr.write_record(&["FDNC", "DNC", "Invalid", "No Carrier"])?;

    // Write phone numbers to the CSV file
    for i in 0..max_len {
        let mut record = Vec::new();

        // Extract values from each collection, or empty string if out of bounds
        record.push(fdnc_expanded.get(i).unwrap_or(&"".to_string()).clone());
        record.push(dnc_expanded.get(i).unwrap_or(&"".to_string()).clone());
        record.push(invalid_expanded.get(i).unwrap_or(&"".to_string()).clone());
        record.push(no_carrier_expanded.get(i).unwrap_or(&"".to_string()).clone());

        // Write the record to the CSV
        wtr.write_record(&record)?;
    }

    println!("Final report generated at '{}'", final_output_file);
    Ok(())
}