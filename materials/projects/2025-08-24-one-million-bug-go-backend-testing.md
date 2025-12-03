---
date: 2025-08-24
---

# One Million Bug: Go Backend Testing

Educational project demonstrating a critical vulnerability in a banking transaction system and a comprehensive testing framework to detect it.

## Overview

This project showcases a real-world scenario where a logical bug in a banking API could lead to fund duplication. It includes both a buggy server implementation and a fixed version, along with a sophisticated Go testing framework that successfully identifies the vulnerability through property-based and integration testing.

## Features

- **Two server implementations**: Fixed and buggy versions for comparison
- **Comprehensive test suite**: Integration, E2E, property-based, and concurrent tests
- **4-layer test architecture**: Test Runner → Infrastructure → Tools/DSL → Scenarios
- **Banking domain DSL**: Specialized test utilities for financial operations
- **Property-based testing**: Using gopter to discover edge cases
- **Testcontainers integration**: Isolated PostgreSQL environments for each test
- **Bug reproduction**: Demonstrates how the vulnerability can be exploited

## Technology Stack

- **Go** - Server and test framework
- **PostgreSQL** - Database with testcontainers
- **Gin** - HTTP framework
- **Gopter** - Property-based testing
- **Zerolog** - Structured logging
- **Docker** - Containerization

## The Bug

When transferring funds to a blocked account:
- **Buggy version**: Returns funds to source AND incorrectly credits blocked destination
- **Fixed version**: Returns funds to source, does NOT credit blocked destination

## Purpose

Educational resource demonstrating:
- Reverse engineering techniques to identify vulnerabilities
- Building production-ready test frameworks for financial systems
- Property-based testing for discovering edge cases
- Layered test architecture following Go best practices
- Importance of comprehensive testing in fintech applications

## Links

- **GitHub**: [https://github.com/Andrey-Roshchupkin/one-million-bug-go-backend-testing](https://github.com/Andrey-Roshchupkin/one-million-bug-go-backend-testing)