# -*- coding: utf-8 -*-
import sys
import os

# 인코딩 설정
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

try:
    import olefile
    
    def extract_prvtext(hwp_path):
        """PrvText 스트림에서 텍스트 추출 (한글 미리보기 텍스트)"""
        if not olefile.isOleFile(hwp_path):
            return None
        
        ole = olefile.OleFileIO(hwp_path)
        
        # PrvText 스트림 읽기
        if 'PrvText' in [s if isinstance(s, str) else '/'.join(s) for s in ole.listdir()]:
            try:
                stream = ole.openstream('PrvText')
                content = stream.read()
                
                # UTF-16 LE로 디코딩 시도 (한글 파일의 일반적인 인코딩)
                try:
                    text = content.decode('utf-16-le', errors='ignore')
                    return text
                except:
                    try:
                        text = content.decode('utf-8', errors='ignore')
                        return text
                    except:
                        text = content.decode('cp949', errors='ignore')
                        return text
            except Exception as e:
                print(f"PrvText 읽기 오류: {e}")
        
        ole.close()
        return None
    
    # 파일 처리
    files = {
        '시니어 체육활동 프로그램.hwp': '체육활동_프로그램.txt',
        '홈페이지에 실릴 시니온.hwp': '홈페이지_시니온.txt'
    }
    
    for hwp_file, txt_file in files.items():
        if os.path.exists(hwp_file):
            print("=" * 80)
            print(f"파일: {hwp_file}")
            print("=" * 80)
            
            text = extract_prvtext(hwp_file)
            
            if text:
                # 텍스트 정리 (의미있는 부분만)
                lines = text.split('\n')
                cleaned_lines = []
                for line in lines:
                    line = line.strip()
                    # 한글이 포함된 라인만 추출
                    if line and any('\uac00' <= c <= '\ud7a3' for c in line):
                        cleaned_lines.append(line)
                
                cleaned_text = '\n'.join(cleaned_lines)
                
                # 파일로 저장
                with open(txt_file, 'w', encoding='utf-8') as f:
                    f.write(cleaned_text)
                
                print(f"\n추출된 텍스트 (처음 2000자):")
                print("-" * 80)
                print(cleaned_text[:2000])
                print("-" * 80)
                print(f"\n전체 내용이 {txt_file}에 저장되었습니다.")
            else:
                print("텍스트를 추출할 수 없습니다.")
            
            print("=" * 80)
            print("\n")

except Exception as e:
    print(f"오류: {e}")
    import traceback
    traceback.print_exc()
