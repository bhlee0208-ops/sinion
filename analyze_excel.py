import pandas as pd
import sys

try:
    # 엑셀 파일 읽기
    file_path = '홈페이지 시니온.xlsx'
    xls = pd.ExcelFile(file_path)
    
    print("=" * 60)
    print("엑셀 파일 분석 결과")
    print("=" * 60)
    print(f"\n시트 목록: {xls.sheet_names}")
    print(f"총 시트 수: {len(xls.sheet_names)}\n")
    
    # 각 시트별로 분석
    for sheet_name in xls.sheet_names:
        print(f"\n{'='*60}")
        print(f"시트명: {sheet_name}")
        print(f"{'='*60}")
        
        df = pd.read_excel(xls, sheet_name=sheet_name)
        print(f"행 수: {len(df)}, 열 수: {len(df.columns)}")
        print(f"\n컬럼명:")
        for i, col in enumerate(df.columns, 1):
            print(f"  {i}. {col}")
        
        print(f"\n첫 10행 미리보기:")
        print(df.head(10).to_string())
        print(f"\n데이터 타입:")
        print(df.dtypes)
        print("\n")
        
except Exception as e:
    print(f"오류 발생: {e}")
    import traceback
    traceback.print_exc()



