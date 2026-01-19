import pickle

# Try to inspect the files
files = ['tfidf_vectorizer.pkl', 'virality_model.pkl']

for file_name in files:
    print(f"\n=== Checking {file_name} ===")
    try:
        # Read first few bytes
        with open(file_name, 'rb') as f:
            header = f.read(10)
            print(f"First 10 bytes (hex): {header.hex()}")
            print(f"First 10 bytes (raw): {header}")
            
        # Try to load
        with open(file_name, 'rb') as f:
            try:
                obj = pickle.load(f)
                print(f"✓ Successfully loaded as pickle")
                print(f"Type: {type(obj)}")
                print(f"Attributes: {dir(obj)[:10]}")
            except Exception as e:
                print(f"✗ Failed to load as pickle: {e}")
                
    except Exception as e:
        print(f"Error reading file: {e}")

print("\n" + "="*50)
print("If you see 'invalid load key', the files might be:")
print("1. Created with joblib instead of pickle")
print("2. Compressed (gzip/bz2)")
print("3. Corrupted during transfer")
print("\nTrying with joblib...")

try:
    import joblib
    for file_name in files:
        print(f"\nTrying {file_name} with joblib...")
        try:
            obj = joblib.load(file_name)
            print(f"✓ Successfully loaded with joblib!")
            print(f"Type: {type(obj)}")
        except Exception as e:
            print(f"✗ Failed: {e}")
except ImportError:
    print("joblib not installed. Install with: pip install joblib")
