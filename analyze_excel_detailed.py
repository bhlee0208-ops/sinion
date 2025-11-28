# -*- coding: utf-8 -*-
import pandas as pd
import json

file_path = '홈페이지 시니온.xlsx'
xls = pd.ExcelFile(file_path)

print("=" * 80)
print("시니온 홈페이지 엑셀 파일 상세 분석")
print("=" * 80)

for sheet_name in xls.sheet_names:
    if sheet_name == 'Sheet3':  # 빈 시트는 스킵
        continue
        
    print(f"\n{'='*80}")
    print(f"시트명: {sheet_name}")
    print(f"{'='*80}")
    
    # 헤더 없이 읽어서 구조 파악
    df_raw = pd.read_excel(xls, sheet_name=sheet_name, header=None)
    
    print(f"\n전체 데이터 구조:")
    print(f"행 수: {len(df_raw)}, 열 수: {len(df_raw.columns)}")
    
    # 실제 데이터가 있는 행만 필터링
    df_clean = df_raw.dropna(how='all').dropna(axis=1, how='all')
    
    print(f"\n데이터가 있는 행/열:")
    print(f"행 수: {len(df_clean)}, 열 수: {len(df_clean.columns)}")
    
    print(f"\n전체 데이터 내용:")
    for idx, row in df_clean.iterrows():
        row_data = [str(val) if pd.notna(val) else '' for val in row]
        if any(row_data):  # 빈 행이 아닌 경우만 출력
            print(f"\n행 {idx+1}:")
            for col_idx, val in enumerate(row_data):
                if val and val != 'nan':
                    print(f"  열 {col_idx+1}: {val}")
    
    # JSON으로 저장 (구조 파악용)
    output_file = f"{sheet_name}_data.json"
    data_dict = {}
    for idx, row in df_clean.iterrows():
        row_data = {}
        for col_idx, val in enumerate(row):
            if pd.notna(val) and str(val) != 'nan':
                row_data[f'col_{col_idx+1}'] = str(val)
        if row_data:
            data_dict[f'row_{idx+1}'] = row_data
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data_dict, f, ensure_ascii=False, indent=2)
    
    print(f"\n데이터가 JSON 파일로 저장되었습니다: {output_file}")



