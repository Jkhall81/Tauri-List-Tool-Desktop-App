use std::collections::HashMap;
use std::error::Error;
use std::fs::File;
use std::path::Path;
use std::fs;
use regex::Regex;
use csv::{ReaderBuilder, WriterBuilder};

pub fn generate_final_file(output_dir: &str, source_file: &str) -> Result<(), Box<dyn Error>> {
    // println!("Looking for extractedNumbers file in: {}", output_dir);

    // Debug: Print all files in output_dir
    // for entry in fs::read_dir(output_dir)? {
    //     if let Ok(entry) = entry {
    //         let file_name = entry.file_name().into_string().unwrap_or_default();
    //         println!("Found file: {}", file_name);
    //     }
    // }

    // Regex Fun
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

    // println!("Attempting to open extracted file: {}", extracted_file);

    // Final file format
    let source_file_name = Path::new(source_file)
    .file_name()
    .unwrap_or_default()
    .to_str()
    .unwrap_or_default();

    let final_output_file = format!("{}\\Final_{}", output_dir, source_file_name.replace("Source_", ""));

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
    let extracted_numbers = read_csv_to_phone_map(&extracted_file)?;
    let all_clean = read_csv_to_phone_map(&all_clean_file)?;
    let fdnc = read_csv_to_phone_map(&fdnc_file)?;
    let invalid = read_csv_to_phone_map(&invalid_file)?;
    let no_carrier = read_csv_to_phone_map(&no_carrier_file)?;
    let dnc = filter_dnc_numbers(&extracted_file, &all_clean_file, &fdnc_file, &invalid_file)?;

    // Flattening the values from each collection (values from the hashmaps)
    let extracted_numbers: Vec<String> = extracted_numbers.keys().cloned().collect();
    let all_clean: Vec<String> = all_clean.keys().cloned().collect();
    let fdnc: Vec<String> = fdnc.keys().cloned().collect();
    let dnc: Vec<String> = dnc.keys().cloned().collect();
    let invalid: Vec<String> = invalid.keys().cloned().collect();
    let no_carrier: Vec<String> = no_carrier.keys().cloned().collect();

    // Open Writer
    let mut wtr = WriterBuilder::new().from_path(&final_output_file)?;
    wtr.write_record(&["All", "All Clean", "FDNC", "DNC", "Invalid", "No Carrier"])?;

    // Preparing rows
    let max_rows = extracted_numbers.len()
        .max(all_clean.len())
        .max(fdnc.len())
        .max(invalid.len())
        .max(no_carrier.len());

        for i in 0..max_rows {
            let mut row = vec![""; 6];  // Initialize the row with empty values
        
            // Fill the row with values from the corresponding columns (if available)
            if i < extracted_numbers.len() {
                row[0] = &extracted_numbers[i];
            }
            if i < all_clean.len() {
                row[1] = &all_clean[i];
            }
            if i < fdnc.len() {
                row[2] = &fdnc[i];
            }
            if i < dnc.len() {
                row[3] = &dnc[i];
            }
            if i < invalid.len() {
                row[4] = &invalid[i];
            }
            if i < no_carrier.len() {
                row[5] = &no_carrier[i];
            }
        
            // Write the row to the CSV
            wtr.write_record(&row)?;
        }
    println!("Final report generated at '{}'", final_output_file);
    Ok(())
}

pub fn filter_dnc_numbers(
    extracted_file: &str,
    all_clean_file: &str,
    federal_dnc_file: &str,
    invalid_file: &str
) -> Result<HashMap<String, u32>, Box<dyn Error>> {
    // Hash Maps
    let extracted_numbers = read_csv_to_phone_map(extracted_file)?;
    let all_clean = read_csv_to_phone_map(all_clean_file)?;
    let federal_dnc = read_csv_to_phone_map(federal_dnc_file)?;
    let invalid = read_csv_to_phone_map(invalid_file)?;

    let mut dnc_map: HashMap<String, u32> = HashMap::new();

    // Iterating
    for (phone_number, count) in extracted_numbers.iter() {
        if !all_clean.contains_key(phone_number) && !federal_dnc.contains_key(phone_number) && !invalid.contains_key(phone_number) {
            dnc_map.insert(phone_number.clone(), *count);
        }
    }
    Ok(dnc_map)
}

pub fn read_csv_to_phone_map(file_path: &str) -> Result<HashMap<String, u32>, Box<dyn Error>> {
    let mut phone_map: HashMap<String, u32> = HashMap::new();

    // Open file
    let file = File::open(file_path)?;
    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .from_reader(file);

    // Iterating
    for result in rdr.records() {
        let record = result?;
        for field in record.iter() {
            let phone_number = field.trim().to_string();
            if !phone_number.is_empty() {
                *phone_map.entry(phone_number).or_insert(0) += 1;
            }
        }
     }
     Ok(phone_map)
}