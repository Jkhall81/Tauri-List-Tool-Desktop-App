use std::fs::{self, File};
use std::io::{BufRead, BufReader, Write};
use std::error::Error;
use std::path::Path;
use chrono::Local;

pub fn chunk_txt_file(input_file: &str, numbers_per_file: usize, output_dir: &str) -> Result<(), Box<dyn Error>> {
    let chunks_dir = format!("{}\\chunks", output_dir);

    if !Path::new(&output_dir).exists() {
        fs::create_dir(&output_dir)?;
    }
    if !Path::new(&chunks_dir).exists() {
        fs::create_dir(&chunks_dir)?;
    }

    let file = File::open(input_file).expect("Could not open input file");
    let reader = BufReader::new(file);

    let mut numbers = Vec::new();
    let mut file_count = 0;
    let mut line_count = 0;

    for line in reader.lines() {
        let line = line?;
        numbers.push(line);
        line_count += 1;

        if line_count == numbers_per_file {
            file_count += 1;
            write_to_file(&chunks_dir, file_count, &numbers)?;
            numbers.clear();
            line_count = 0;
        }
    }

    if !numbers.is_empty() {
        file_count += 1;
        write_to_file(&chunks_dir, file_count, &numbers)?;
    }

    println!("Files created in directory '{}'", output_dir);
    Ok(())
}

fn write_to_file(dir: &str, count: usize, numbers: &[String]) -> Result<(), Box<dyn Error>> {
    let date = Local::now().format("%m_%d_%Y");
    let file_name = format!("{}/output_{}_{}.txt", dir, date, count);
    let mut file = File::create(&file_name)?;

    for number in numbers {
        writeln!(file, "{}", number)?;
    }

    println!("Created file: {}", file_name);
    Ok(())
}