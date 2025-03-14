use regex::Regex;
use std::collections::HashMap;
use std::error::Error;
use std::fs::{File, self};
use std::path::Path;
use csv::{ReaderBuilder, WriterBuilder};


pub fn generate_final_file(output_dir: &str, source_file: &str) -> Result<(), Box<dyn Error>> {
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

    let source_file_name = Path::new(source_file)
        .file_name()
        .unwrap_or_default()
        .to_str()
        .unwrap_or_default();

    let final_output_file = format!("{}\\Final_{}", output_dir, source_file_name.replace("Source_", ""));

    // File Paths
    let all_clean_file = format!("{}\\all_clean.csv", output_dir);
    let fdnc_file = format!("{}\\federal_dnc.csv", output_dir);
    let invalid_file = format!("{}\\invalid.csv", output_dir);
    let no_carrier_file = format!("{}\\no_carrier.csv", output_dir);

    // Read CSV data into HashMaps
    let extracted_numbers = read_csv_to_phone_map(&extracted_file)?;
    let all_clean = read_csv_to_phone_map(&all_clean_file)?;
    let fdnc = read_csv_to_phone_map(&fdnc_file)?;
    let invalid = read_csv_to_phone_map(&invalid_file)?;
    let no_carrier = read_csv_to_phone_map(&no_carrier_file)?;
    let dnc = filter_dnc_numbers(&extracted_file, &all_clean_file, &fdnc_file, &invalid_file)?;

    // Open CSV Writer
    let mut wtr = WriterBuilder::new().from_path(&final_output_file)?;
    wtr.write_record(&["All", "All Clean", "FDNC", "DNC", "Invalid", "No Carrier"])?;

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
    let extracted_numbers_expanded = expand_phone_numbers(&extracted_numbers);
    let all_clean_expanded = expand_phone_numbers(&all_clean);
    let fdnc_expanded = expand_phone_numbers(&fdnc);
    let dnc_expanded = expand_phone_numbers(&dnc);
    let invalid_expanded = expand_phone_numbers(&invalid);
    let no_carrier_expanded = expand_phone_numbers(&no_carrier);

    // Determine the maximum length of the columns
    let max_len = vec![
        extracted_numbers_expanded.len(),
        all_clean_expanded.len(),
        fdnc_expanded.len(),
        dnc_expanded.len(),
        invalid_expanded.len(),
        no_carrier_expanded.len(),
    ]
    .into_iter()
    .max()
    .unwrap_or(0);

    // Write phone numbers to the CSV file
    for i in 0..max_len {
        let mut record = Vec::new();

        // Extract values from each collection, or empty string if out of bounds
        record.push(extracted_numbers_expanded.get(i).unwrap_or(&"".to_string()).clone());
        record.push(all_clean_expanded.get(i).unwrap_or(&"".to_string()).clone());
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
pub fn filter_dnc_numbers(
    extracted_file: &str,
    all_clean_file: &str,
    federal_dnc_file: &str,
    invalid_file: &str
) -> Result<HashMap<String, u32>, Box<dyn Error>> {
    let extracted_numbers = read_csv_to_phone_map(extracted_file)?;
    let all_clean = read_csv_to_phone_map(all_clean_file)?;
    let federal_dnc = read_csv_to_phone_map(federal_dnc_file)?;
    let invalid = read_csv_to_phone_map(invalid_file)?;

    let mut dnc_map: HashMap<String, u32> = HashMap::new();

    // Only include phone numbers from `extracted_numbers` not found in other lists
    for (phone_number, count) in extracted_numbers.iter() {
        if !all_clean.contains_key(phone_number)
            && !federal_dnc.contains_key(phone_number)
            && !invalid.contains_key(phone_number)
        {
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

    // Iterating over CSV rows
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
