import os
import zipfile
import re
from pathlib import Path
import shutil

class DocxImageExtractor:
    def __init__(self, docx_folder, output_base):
        self.docx_folder = Path(docx_folder)
        self.output_base = Path(output_base)
        self.document_mappings = {
            'ATR_Clashes Manager_Отработка коллизий_Архитекторам.docx': 'clashes_manager',
            'ATR_Navisworks_Работа с коллизиями.docx': 'navisworks',
            'ATR_Выгрузка  моделей 12.2 V.2.docx': 'model_export',
            'ATR_Заполнение Код СВОР для архитекторов.docx': 'svod_codes',
            'ATR_Подрезка коллизий_Revit Helper.docx': 'clashes_helper'
        }
        
    def get_document_short_name(self, filename):
        """Получить сокращенное имя документа"""
        return self.document_mappings.get(filename, filename.replace('.docx', '').replace(' ', '_').lower())
    
    def extract_images_from_docx(self, docx_path, output_folder):
        """Извлечь изображения из .docx файла"""
        docx_path = Path(docx_path)
        if not docx_path.exists():
            print(f"Файл не найден: {docx_path}")
            return []
        
        # Создаем временную папку для извлечения
        temp_folder = output_folder / 'temp_extract'
        temp_folder.mkdir(exist_ok=True)
        
        extracted_images = []
        
        try:
            # Распаковываем .docx файл как zip
            with zipfile.ZipFile(docx_path, 'r') as zip_ref:
                zip_ref.extractall(temp_folder)
            
            # Ищем изображения в папке word/media
            media_folder = temp_folder / 'word' / 'media'
            if media_folder.exists():
                for image_file in media_folder.iterdir():
                    if image_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:
                        # Копируем изображение в выходную папку
                        dest_path = output_folder / image_file.name
                        shutil.copy2(image_file, dest_path)
                        extracted_images.append(dest_path)
                        print(f"Извлечено изображение: {dest_path}")
            
        except Exception as e:
            print(f"Ошибка при извлечении изображений из {docx_path}: {e}")
        finally:
            # Удаляем временную папку
            if temp_folder.exists():
                shutil.rmtree(temp_folder)
        
        return extracted_images
    
    def process_all_documents(self):
        """Обработать все .docx файлы в папке"""
        if not self.docx_folder.exists():
            print(f"Папка не найдена: {self.docx_folder}")
            return
        
        # Создаем основную папку для изображений
        images_main_folder = self.output_base / 'docs' / 'images'
        images_main_folder.mkdir(parents=True, exist_ok=True)
        
        # Обрабатываем каждый .docx файл
        for docx_file in self.docx_folder.glob('*.docx'):
            print(f"Обработка файла: {docx_file.name}")
            
            # Создаем папку для текущего документа
            doc_short_name = self.get_document_short_name(docx_file.name)
            doc_folder = images_main_folder / doc_short_name
            doc_folder.mkdir(exist_ok=True)
            
            # Извлекаем изображения
            extracted_images = self.extract_images_from_docx(docx_file, doc_folder)
            
            if extracted_images:
                print(f"Из файла {docx_file.name} извлечено {len(extracted_images)} изображений")
            else:
                print(f"В файле {docx_file.name} не найдено изображений")
        
        print(f"Обработка завершена. Изображения сохранены в: {images_main_folder}")

def main():
    # Пути к папкам
    docx_folder = 'docs/docx'
    output_base = 'static'
    
    # Создаем экстрактор
    extractor = DocxImageExtractor(docx_folder, output_base)
    
    # Обрабатываем все документы
    extractor.process_all_documents()

if __name__ == "__main__":
    main()