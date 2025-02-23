use csv::{ReaderBuilder, WriterBuilder};
use chrono::Local;
use std::error::Error;


pub fn extract_phone_numbers(input_file: &str, output_dir: &str) -> Result<String, Box<dyn Error>> {
    // Generate the output file name with the current date
    let date = Local::now().format("%m_%d_%Y").to_string();
    let output_file = format!("{}\\extractedNumbers_{}.csv", output_dir, date);

    // Open the input CSV file
    let mut rdr = ReaderBuilder::new()
        .has_headers(true) // Always skip the first line (header)
        .from_path(input_file)?;

    // Open the output CSV file
    let mut wtr = WriterBuilder::new().from_path(&output_file)?;
    wtr.write_record(&["phone_numbers"])?;

    // Process the rows to extract valid phone numbers
    for result in rdr.records() {
        let record = result?;
        for field in record.iter() {
            if is_valid_phone_number(field) {
                wtr.write_record(&[field])?;
            }
        }
    }

    println!("Phone numbers have been extracted to '{}'.", output_file);

    Ok(output_file)
}

fn is_valid_phone_number(phone_number: &str) -> bool {
    // Check if the phone number is valid (10 digits or starts with '1' followed by 10 digits)
    phone_number.len() == 10 && phone_number.chars().all(|c| c.is_numeric())
        || (phone_number.len() == 11
            && phone_number.starts_with('1')
            && phone_number.chars().skip(1).all(|c| c.is_numeric()))
}
