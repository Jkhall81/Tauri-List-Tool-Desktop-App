use regex::Regex;
use std::fs;
use std::error::Error;
use crate::final_file::read_csv_to_phone_map;
use crate::final_file::filter_dnc_numbers;

pub fn generate_email_report_file(source_file: &str, output_dir: &str, abbr: &str, color: &str) -> Result<String, Box<dyn Error>> {

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

    let mut final_source_file = String::new();

    // Slice source file name out of full path
    if let Some(pos) = source_file.find("Source_") {
        final_source_file = source_file[pos..].to_string();
    }

    

    // Other File Paths
    let all_clean_file = format!("{}\\all_clean.csv", output_dir);
    let fdnc_file = format!("{}\\federal_dnc.csv", output_dir);
    let invalid_file = format!("{}\\invalid.csv", output_dir);
    let no_carrier_file = format!("{}\\no_carrier.csv", output_dir);
   
    // Hashmaps
    let extracted_numbers = read_csv_to_phone_map(&extracted_file)?;
    let all_clean = read_csv_to_phone_map(&all_clean_file)?;
    let fdnc = read_csv_to_phone_map(&fdnc_file)?;
    let invalid = read_csv_to_phone_map(&invalid_file)?;
    let no_carrier = read_csv_to_phone_map(&no_carrier_file)?;
    let dnc = filter_dnc_numbers(&extracted_file, &all_clean_file, &fdnc_file, &invalid_file)?;

    // Totals.
    let extracted_numbers_len = extracted_numbers.len();
    let all_clean_len = all_clean.len();
    let fdnc_len = fdnc.len();
    let dnc_len = dnc.len();
    let invalid_len = invalid.len();
    let no_carrier_len = no_carrier.len();
    let total_dnc = fdnc_len + dnc_len;

    let email_report = format!(
        "
        Blacklist Upload Results: {}
    
        0/{invalid_len} invalid, 0/{no_carrier_len} No carrier {abbr} ** {color} **
        0/{dnc_len} DNC added to {abbr}, 0/{dnc_len} DNC added to BP of {abbr}
        0/{fdnc_len} FDNC added to {abbr} and 0/{fdnc_len} FDNC added to BP of {abbr}
    
        Total Leads: {extracted_numbers_len}
        Total Clean: {all_clean_len}
        Total DNC composition {fdnc_len} FDNC, {dnc_len} DNC, Total DNC: {total_dnc}
        No-Carrier {no_carrier_len}
        ",
        final_source_file, // Pass the variable here
    );
    Ok(email_report)
}