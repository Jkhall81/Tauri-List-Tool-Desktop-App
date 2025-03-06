use std::error::Error;
use std::fs::{self, File};
use std::path::Path;
use csv::{ReaderBuilder, WriterBuilder, StringRecord, QuoteStyle};

pub fn chunk_csv_list(input_file: &str, output_folder: &str, max_line: usize, start_chunk_number: Option<usize>) -> Result<String, Box<dyn Error>> {
    fs::create_dir_all(output_folder)?;

    let file = File::open(input_file)?;
    let mut reader = ReaderBuilder::new().has_headers(true).from_reader(file);

    let header = reader.headers()?.clone();

    let mut chunk_number = start_chunk_number.unwrap_or(1);
    let mut line_count = 0;
    let mut writer = create_writer(output_folder, input_file, chunk_number, &header)?;

    for result in reader.records() {
        let record = result?;

        writer.write_record(&record)?;
        line_count += 1;

        if line_count == max_line {
            writer.flush()?;
            chunk_number += 1;
            line_count = 0;
            writer = create_writer(output_folder, input_file, chunk_number, &header)?;
        }
    }
    writer.flush()?;

    let output_message = format!("CSV file '{}' split into chunks of {} lines. Output saved to '{}'.",
    input_file, max_line, output_folder);

    Ok(output_message)
}


fn create_writer(
    output_folder: &str,
    input_file: &str,
    chunk_number: usize,
    header: &StringRecord,
) -> Result<csv::Writer<File>, Box<dyn Error>> {
    let chunks_folder = format!("{}/chunks", output_folder);
    fs::create_dir_all(&chunks_folder)?;

    let input_file_name = Path::new(input_file)
        .file_stem()
        .and_then(|s| s.to_str())
        .ok_or("Invalid input file name")?;

    let output_file = format!(
        "{}/{}_{}.csv",
        chunks_folder, input_file_name, chunk_number
    );

    let mut writer = WriterBuilder::new().quote_style(QuoteStyle::Always).from_path(output_file)?;

    writer.write_record(header)?;

    Ok(writer)
}