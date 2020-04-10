cd src\processor
dotnet lambda package
move-item .\bin\Release\netcoreapp2.1\processor.zip ..\..\..\terraform\processor.zip -Force
cd ..\..\