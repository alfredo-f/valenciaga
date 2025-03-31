import mimetypes
from pathlib import Path

import boto3

boto3.setup_default_session(
    profile_name='PERSONAL__user_root',
    region_name='eu-west-1',
)


def main():
    s3 = boto3.client('s3')
    bucket_name = 'public-webpage-countdown-eu-west-1-165023307857'
    source_path = Path(r"C:\Users\a.fomitchenko\PycharmProjects\public_webpage_countdown\app")
    assert bucket_name == 'public-webpage-countdown-eu-west-1-165023307857'
    # Remove everything inside the bucket
    print(f"Removing all objects from bucket {bucket_name}")
    s3.delete_objects(
        Bucket=bucket_name,
        Delete={
            'Objects': [
                {'Key': obj['Key']} for obj in s3.list_objects_v2(Bucket=bucket_name).get('Contents', [])
            ]
        }
    )
    # Upload all to the root of the bucket
    for file in source_path.glob('**/*'):
        if file.is_file():
            # Create the destination path
            destination_path = file.relative_to(source_path)
            print(f"Uploading {file} to {destination_path}")
            # Determine content type based on file extension
            content_type = mimetypes.guess_type(str(file))[0]
            if content_type is None:
                # Default to binary if content type is unknown
                content_type = 'application/octet-stream'

            # HTML files should have text/html content type
            if file.suffix.lower() == '.html':
                content_type = 'text/html'
            elif file.suffix.lower() == '.css':
                content_type = 'text/css'
            elif file.suffix.lower() == '.js':
                content_type = 'application/javascript'

            # Upload the file with content type
            s3.upload_file(
                str(file),
                bucket_name,
                str(destination_path),
                ExtraArgs={'ContentType': content_type}
            )


if __name__ == '__main__':
    main()
