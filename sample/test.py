from io import StringIO
import pandas as pd

file = """#replace_here#"""
# file = open("data.csv").read()
TESTDATA = StringIO(file)

sep = ","
if ";" in file:
    sep = ";"

df = pd.read_csv(TESTDATA, sep=sep)
def result():
    return df.head().to_json(orient='records')