use std::collections::HashMap;
use std::error::Error;
use std::fs::File;
use regex::Regex;
use std::path::Path;
use csv::{ReaderBuilder, WriterBuilder};

pub fn generate_final_report(output_dir: &str, source_file: &str) -> Result<(), Box<dyn Error>> {
    // Regex Fun
    let extracted_file_pattern = Regex::new(r"extractedNumbers_\d+_\d+_\d+_\d+\.csv")?;
    let extracted_file = fs::read_dir(output_dir)?
        .filter_map(Result::ok)
        .filter_map(|entry| {
            let file_name = entry.file_name().into_string().ok()?;
            if extracted_file_pattern.is_match(&file_name) {
                Some(format!("{}/{}", output_dir, file_name))
            } else {
                None
            }
        })
        .next()
        .ok_or("No extractedNumbers file found")?;

    // Final file format
    let final_output_file = format!("{}/{}", output_dir, source_file.replacen("Source_", "Final_", 1));


    // Other File Paths
    let all_clean_file = format!("{}/all_clean.csv", output_dir);
    let fdnc_file = format!("{}/federal_dnc.csv", output_dir);
    let invalid_file = format!("{}/invalid.csv", output_dir);
    let no_carrier_file = format!("{}/no_carrier.csv", output_dir);
   

    // Hashmaps
    let mut extracted_numbers = read_csv_to_phone_map(&extracted_file)?;
    let mut all_clean = read_csv_to_phone_map(&all_clean_file)?;
    let mut fdnc = read_csv_to_phone_map(&fdnc_file)?;
    let mut invalid = read_csv_to_phone_map(&invalid_file)?;
    let mut no_carrier = read_csv_to_phone_map(&no_carrier_file)?;
    let mut dnc = filter_dnc_numbers(&all_file, &all_clean_file, &fdnc_file, &invalid_file)?;

    // Open Writer
    let mut wtr = WriterBuilder::new().from_path(&final_output_file)?;
    wtr.write_record(&["All", "All Clean", "FDNC", "DNC", "Invalid", "No Carrier"])?;

    // Preparing rows
    for (number, _) in all_numbers.is_some() {
        let mut row = vec![""; 6];

        if all_numbers.remove(number).is_some() {
            row[0] = number;
        }

        if all_clean.remove(number).is_some() {
            row[1] = number;
        }

        if fdnc.remove(number).is_some() {
            row[2] = number;
        }

        if dnc.remove(number).is_some() {
            row[3] = number;
        }

        if invalid.remove(number).is_some() {
            row[4] = number;
        }

        if no_carrier.remove(number).is_some() {
            row[5] = number;
        }
        wtr.write_record(&row)?;
    }
    println!("Final report generated at '{}', final_output_file");
    Ok(())
}

fn filter_dnc_numbers(
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

fn read_csv_to_phone_map(file_path: &str) -> Result<HashMap<String, u32>, Box<dyn Error>> {
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