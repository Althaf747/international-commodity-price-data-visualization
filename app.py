import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# Load data
@st.cache_data
def load_data(path):
    df = pd.read_csv(path)
    return df

data = load_data('Selected_International_Commodity_Prices_data.csv')

st.title("Visualisasi Data Harga Komoditas Internasional")

# Pilih komoditas unik
commodities = data['COMMODITY'].dropna().unique()
selected_commodity = st.selectbox("Pilih Komoditas", sorted(commodities))

# Filter data berdasarkan komoditas yang dipilih
filtered_data = data[data['COMMODITY'] == selected_commodity]

# Pilih indikator unik dari data terfilter
indicators = filtered_data['INDICATOR'].dropna().unique()
selected_indicator = st.selectbox("Pilih Indikator", sorted(indicators))

# Filter data berdasarkan indikator yang dipilih
filtered_data = filtered_data[filtered_data['INDICATOR'] == selected_indicator]

# Ubah kolom TIME_PERIOD jadi datetime
filtered_data['TIME_PERIOD'] = pd.to_datetime(filtered_data['TIME_PERIOD'], errors='coerce')

# Sort data berdasarkan waktu
filtered_data = filtered_data.sort_values('TIME_PERIOD')

# Tampilkan grafik tren harga (OBS_VALUE)
fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(filtered_data['TIME_PERIOD'], filtered_data['OBS_VALUE'], marker='o')
ax.set_title(f"Tren {selected_commodity} - {selected_indicator}")
ax.set_xlabel("Waktu")
ax.set_ylabel("Nilai Observasi (OBS_VALUE)")
ax.grid(True)
st.pyplot(fig)

# Tampilkan data tabel hasil filter
st.write("Data Tabel:")
st.dataframe(filtered_data[['TIME_PERIOD', 'OBS_VALUE', 'UNIT_MEASURE']])
