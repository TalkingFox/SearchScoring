cd src\processor
dotnet lambda package
move-item .\bin\Release\netcoreapp3.1\processor.zip ..\..\..\terraform\processor.zip -Force
cd ..\..\