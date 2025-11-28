# -*- coding: utf-8 -*-
import os
import sys

# 인코딩 설정
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

try:
    import olefile
    
    def extract_text_from_hwp(file_path):
        """HWP 파일에서 텍스트 추출"""
        if not olefile.isOleFile(file_path):
            return "HWP 파일 형식이 아닙니다."
        
        ole = olefile.OleFileIO(file_path)
        streams = ole.listdir()
        
        print(f"발견된 스트림: {streams}")
        
        text_parts = []
        
        # 주요 스트림들 확인
        important_streams = ['BodyText', 'Section0', 'PrvText', 'DocInfo']
        
        for stream_name in streams:
            stream_path = stream_name if isinstance(stream_name, str) else '/'.join(stream_name)
            print(f"\n스트림 처리 중: {stream_path}")
            
            try:
                stream = ole.openstream(stream_name)
                content = stream.read()
                
                # 다양한 인코딩으로 시도
                for encoding in ['utf-8', 'cp949', 'euc-kr', 'latin1']:
                    try:
                        text = content.decode(encoding, errors='ignore')
                        # 한글이 포함되어 있고 의미있는 길이인지 확인
                        korean_chars = sum(1 for c in text[:500] if '\uac00' <= c <= '\ud7a3')
                        if korean_chars > 10 or len(text.strip()) > 50:
                            print(f"  {encoding} 인코딩으로 텍스트 추출 성공 ({len(text)}자)")
                            text_parts.append(f"=== {stream_path} ({encoding}) ===\n{text}")
                            break
                    except:
                        continue
                        
            except Exception as e:
                print(f"  스트림 읽기 오류: {e}")
                continue
        
        ole.close()
        return '\n\n'.join(text_parts) if text_parts else "텍스트를 추출할 수 없습니다."
    
    # 파일 읽기
    files = ['시니어 체육활동 프로그램.hwp', '홈페이지에 실릴 시니온.hwp']
    
    for file_name in files:
        if os.path.exists(file_name):
            print("=" * 80)
            print(f"파일 분석: {file_name}")
            print("=" * 80)
            
            content = extract_text_from_hwp(file_name)
            
            # 출력 파일로 저장
            output_file = file_name.replace('.hwp', '_내용.txt')
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"\n\n추출된 내용 (처음 3000자):")
            print("-" * 80)
            print(content[:3000])
            print("-" * 80)
            print(f"\n전체 내용이 {output_file}에 저장되었습니다.")
            print("=" * 80)
            print("\n")
        else:
            print(f"파일을 찾을 수 없습니다: {file_name}")

except ImportError:
    print("olefile 라이브러리를 설치해야 합니다.")
    print("명령어: pip install olefile")
except Exception as e:
    print(f"오류 발생: {e}")
    import traceback
    traceback.print_exc()



