use csv::ReaderBuilder;
use csv::WriterBuilder;
use std::collections::HashMap;
use std::error::Error;

fn process_file(file: &str) -> Result<(HashMap<String, usize>, i32), Box<dyn Error>> {
    let mut rdr = ReaderBuilder::new()
        .has_headers(false)
        .from_path(file)?;
    let mut collection = HashMap::new();
    let mut count = 0;
    
    for result in rdr.records() {
        let record = result?;
        count += 1;
        for value in record.iter() {  
            *collection.entry(value.to_string()).or_insert(0) += 1;
        }
    }
    Ok((collection, count))
}

pub fn process_duplicates(input_file1: &str, input_file2: &str, output_file: &str) -> Result<(usize, i32, i32), Box<dyn Error>> {

    // Process both input files
    let (list_one, count_one) = process_file(input_file1)?;
    let (list_two, count_two) = process_file(input_file2)?;

    // Write duplicates to the output file
    let mut wtr = WriterBuilder::new().from_path(output_file)?;
    let mut duplicate_count = 0;

    for (num, _) in list_one.iter() {
        if list_two.contains_key(num) {
            duplicate_count += 1;
            wtr.write_record(&[num])?;
        }
    }

    if duplicate_count > 1 {
        println!("Duplicates have been written to '{}'.", output_file);
    } else {
        println!("No duplicates found.");
    }

    Ok((duplicate_count, count_one, count_two))
}