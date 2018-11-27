package org.vaccineimpact.api

import me.ntrrgc.tsGenerator.ClassTransformer
import me.ntrrgc.tsGenerator.TypeScriptGenerator
import me.ntrrgc.tsGenerator.camelCaseToSnakeCase
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.AssociateRole
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySet
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithExpectations
import java.io.File
import java.sql.Timestamp
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import kotlin.reflect.KClass
import kotlin.reflect.KProperty
import kotlin.system.exitProcess

fun main(args: Array<String>) {
    if (args.size != 1) {
        println("Please specify the output path as the single command line parameter.")
        println("Output path should be the path to a .ts file.")
        exitProcess(-1)
    } else {
        val outputPath = args.first()
        println("Generating TypeScript model interfaces and storing in $outputPath")

        val generator = TypeScriptGenerator(
                rootClasses = setOf(
                        AssociateRole::class,
                        AssociateUser::class,
                        CohortRestriction::class,
                        CoverageSet::class,
                        Country::class,
                        CreateBurdenEstimateSet::class,
                        Disease::class,
                        DemographicDataset::class,
                        NumberRange::class,
                        ModellingGroup::class,
                        ModellingGroupDetails::class,
                        ModellingGroupCreation::class,
                        ModelRunParameterSet::class,
                        ReportVersion::class,
                        ReportVersionDetails::class,
                        ResponsibilitySetWithExpectations::class,
                        Result::class,
                        Scenario::class,
                        ScenarioAndCoverageSets::class,
                        ScenarioTouchstoneAndCoverageSets::class,
                        Touchstone::class,
                        TouchstoneStatus::class,
                        User::class
                ),
                mappings = mapOf(
                        LocalDateTime::class to "Date",
                        LocalDate::class to "Date",
                        Timestamp::class to "Date",
                        Instant::class to "string",
                        IntRange::class to "NumberRange"
                ),
                ignoreSuperclasses = setOf(Iterable::class, HasKey::class),
                classTransformers = listOf(
                        SnakeCaseTransformer
                ),
                addExportStatements = true,
                enumTransformer = ::transformEnum
        )
        val text = "// Code generated by a tool.\n// Run `npm run generate-models` to regenerate\n\n${generator.definitionsText}"
        println()
        File(outputPath).writeText(text)
    }
}

// A class matching Montagu serialization of Kotlin's IntRange class
data class NumberRange(val MinimumInclusive: Int, val MaximumInclusive: Int)

fun transformEnum(klass: KClass<*>, value: Any): String {
    var asString = value.toString();
    asString = when (value) {
        GAVISupportLevel.NONE -> "no vaccine"
        GAVISupportLevel.WITHOUT -> "no gavi"
        GAVISupportLevel.WITH -> "total"
        else -> asString
    }
    return asString.toLowerCase().replace('_', '-')
}

object SnakeCaseTransformer : ClassTransformer {
    override fun transformPropertyName(propertyName: String, property: KProperty<*>, klass: KClass<*>): String {
        return camelCaseToSnakeCase(propertyName)
    }
}