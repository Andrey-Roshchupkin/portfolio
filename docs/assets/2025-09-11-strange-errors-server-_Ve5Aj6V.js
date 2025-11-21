const e=`---
date: 2025-09-11
---

# Strange Errors Server

A demonstration server built in Go that showcases various HTTP fallacies and unconventional implementations.

## Overview

This project was created to demonstrate how real-world APIs sometimes deviate from HTTP standards for business reasons. It includes examples of non-idempotent POST methods, incorrect status codes, and even a custom HTTP method called GOAT.

## Features

- Non-idempotent POST endpoints
- Idempotent POST endpoints (breaking HTTP rules for business logic)
- Custom HTTP methods (GOAT)
- Incorrect status code usage
- OpenAPI/Swagger documentation

## Technology Stack

- Go
- Gin framework
- Swagger/OpenAPI

## Links

- **GitHub**: [https://github.com/Andrey-Roshchupkin/strange-errors-server](https://github.com/Andrey-Roshchupkin/strange-errors-server)
- **Documentation**: Full API documentation available in the repository

## Purpose

This server serves as an educational tool for QA engineers and developers to understand the gap between HTTP theory and real-world implementations.

`;export{e as default};
