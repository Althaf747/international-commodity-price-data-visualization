import pandas as pd

# 1. Baca data dari file CSV
file_path = 'Selected_International_Commodity_Prices_data.csv'
df = pd.read_csv(file_path)

# 2. Fungsi untuk mengelompokkan komoditas ke kategori
def kategori_komoditas(x):
    logam = ['ALUMINUM', 'COPPER', 'GOLD', 'LEAD', 'NICKEL', 'PLATINUM', 'SILVER', 'Tin', 'Zinc']
    energi = ['COAL_AUS', 'COAL_SAFRICA', 'CRUDE_BRENT', 'CRUDE_DUBAI', 'CRUDE_PETRO', 'CRUDE_WTI', 'iNATGAS', 'NGAS_EUR', 'NGAS_JP', 'NGAS_US']
    pertanian = ['BANANA_EU', 'BANANA_US', 'BARLEY', 'COCOA', 'COCONUT_OIL', 'COFFEE_ARABIC', 'COFFEE_ROBUS', 'COTTON_A_INDX', 'GRNUT', 'GRNUT_OIL', 'MAIZE', 'ORANGE', 'PALM_OIL', 'PLMKRNL_OIL', 'RICE_05', 'RICE_05_VNM', 'RICE_25', 'RICE_A1', 'SORGHUM', 'SOYBEAN_MEAL', 'SOYBEAN_OIL', 'SOYBEANS', 'SUGAR_EU', 'SUGAR_US', 'SUGAR_WLD', 'TEA_AVG', 'TEA_COLOMBO', 'TEA_KOLKATA', 'TEA_MOMBASA', 'TOBAC_US', 'WHEAT_US_HRW', 'WHEAT_US_SRW']
    produk_laut = ['FISH_MEAL', 'SHRIMP_MEX', 'TUNA_SJCSI', 'TUNA_SJFEP', 'TUNA_SJWPO', 'TUNA_YFCSI', 'TUNA_YFFEP', 'TUNA_YFWPO']
    kayu = ['LOGS_CMR', 'LOGS_MYS', 'PLYWOOD', 'SAWNWD_CMR', 'SAWNWD_MYS']
    pupuk_mineral = ['DAP', 'PHOSROCK', 'POTASH', 'TSP', 'UREA_EE_BULK']
    daging = ['BEEF']
    bahan_bangunan = ['IRON_ORE']
    
    if x in logam:
        return 'Logam'
    elif x in energi:
        return 'Energi'
    elif x in pertanian:
        return 'Pertanian'
    elif x in produk_laut:
        return 'Produk Laut'
    elif x in kayu:
        return 'Kayu dan Produk Kayu'
    elif x in pupuk_mineral:
        return 'Pupuk dan Mineral'
    elif x in daging:
        return 'Daging'
    elif x in bahan_bangunan:
        return 'Bahan Bangunan'
    else:
        return 'Lainnya'

# 3. Tambahkan kolom kategori berdasarkan fungsi
df['Category'] = df['COMMODITY'].apply(kategori_komoditas)

# 4. Simpan hasil ke file baru jika perlu
df.to_csv('Selected_International_Commodity_Prices_with_Category.csv', index=False)

# 5. Tampilkan beberapa data hasil pengelompokan sebagai contoh
print(df[['COMMODITY', 'Category']].drop_duplicates().sort_values('Category'))
