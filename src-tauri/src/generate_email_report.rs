use regex::Regex;
use std::fs;
use std::error::Error;
use crate::final_file::read_csv_to_phone_map;
use crate::final_file::filter_dnc_numbers;

pub fn generate_email_report_file(source_file: &str, output_dir: &str, abbr: &str, color: &str) -> Result<String, Box<dyn Error>> {
    // Regex to find the extracted numbers file
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

    // Extract the source file name from the full path
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

    // Calculate totals, including duplicates
    let extracted_numbers_total: u32 = extracted_numbers.values().sum();
    let all_clean_total: u32 = all_clean.values().sum();
    let fdnc_total: u32 = fdnc.values().sum();
    let dnc_total: u32 = dnc.values().sum();
    let invalid_total: u32 = invalid.values().sum();
    let no_carrier_total: u32 = no_carrier.values().sum();
    let total_dnc = fdnc_total + dnc_total;

    // Generate the email report
    let email_report = format!(
        "
        Blacklist Upload Results: {}
    
        0/{invalid_total} invalid, 0/{no_carrier_total} No carrier {abbr} ** {color} **
        0/{dnc_total} DNC added to {abbr}, 0/{dnc_total} DNC added to BP of {abbr}
        0/{fdnc_total} FDNC added to {abbr} and 0/{fdnc_total} FDNC added to BP of {abbr}
    
        Total Leads: {extracted_numbers_total}
        Total Clean: {all_clean_total}
        Total DNC composition {fdnc_total} FDNC, {dnc_total} DNC, Total DNC: {total_dnc}
        No-Carrier {no_carrier_total}
        ",
        final_source_file, // Pass the variable here
    );

    Ok(email_report)
}